"use strict"
// ***************************** Librerie *************************************
import fs from "fs";
import http from "http";
import https from "https";
import express, { application, request } from "express";
import body_parser from "body-parser"; //Per intercettare i parametri nel body
//Il server di default risponde solo alle richieste provenienti da pagine scaricate dal server stesso
import cors from "cors"; //Fa sì che il server risponda solo alle Url indicate all'interno della whitelist
import fileUpload, { UploadedFile } from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";
import {Db, MongoClient, ObjectId}  from "mongodb";
import bcrypt from "bcryptjs" //Per la cifratura bcrypt
import jwt from "jsonwebtoken"//Gestione web token
import environment from "./environment.json"
import { createToken, getDefaultLibFileName } from "typescript";// ***************************** Costanti *************************************
const app = express();
const CONNECTION_STRING = environment.CONNECTION_STRING_ATLAS
const DBNAME = "5B"
const DURATA_TOKEN = 60 // sec
const HTTP_PORT = 1337
const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const jwtKey = fs.readFileSync("keys/jwtKey.pem", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
cloudinary.v2.config({
	cloud_name: environment.CLOUDINARY.CLOUD_NAME,
	api_key: environment.CLOUDINARY.API_KEY,
	api_secret: environment.CLOUDINARY.API_SECRET,
})
// ***************************** Avvio ****************************************
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTPS_PORT, function() {
    console.log("Server HTTPS in ascolto sulla porta " + HTTPS_PORT);
    init();
});
let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", function(err, data) {
        if (!err)
            paginaErrore = data.toString();
        else
            paginaErrore = "<h1>Risorsa non trovata</h1>"
    });
}
// app.response.log = function(err){console.log(`*** Error *** ${err.message}`)}
app.response["log"] = function(err){console.log(`*** Error *** ${err.message}`)}
/* *********************** (Sezione 1) Middleware ********************* */
// 1. Request log
app.use("/", function(req, res, next) {
    console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});
// 2 - route risorse statiche
app.use("/", express.static('./static'));
// 3 - routes di lettura dei parametri post
app.use("/", body_parser.json({ "limit": "10mb" }));
app.use("/", body_parser.urlencoded({"extended": true, "limit": "10mb"}));
// 4 - log dei parametri 
app.use("/", function(req, res, next) {
    if (Object.keys(req.query).length > 0)
        console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
        console.log("        Parametri BODY: ", req.body)
    next();
});
// 5. cors accepting every call
const corsOptions = {
    origin: function(origin, callback) {
          return callback(null, true);
    },
    credentials: true
};
app.use("/", cors(corsOptions));
// 6 - binary upload
app.use("/", fileUpload({
    "limits": { "fileSize": (10 * 1024 * 1024) } // 10*1024*1024 // 10 M
}));
/* ***************** (Sezione 2) middleware relativi a JWT ****************** */
//Gestione login
app.post("/api/login",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING, function(err,client){
        if(err){
            res.status(501).send("Errore connessione al database")["log"](err); //Log dell'errore
        }
        else
        {
            const DB=client.db(DBNAME);
            const collection= DB.collection("Mail-JWT");
            let username= req.body.username;
            //Controllo case unsensitive
            let regex=new RegExp("^"+username+"$","i");
            collection.findOne({"username":regex},function(err,dbUser){
                if(err){
                    res.status(500).send("Errore esecuzione query")["log"](err); //Log dell'errore
                }
                else
                {
                    if(dbUser)
                    {
                        if(req.body.password)
                        {
                            if(bcrypt.compareSync(req.body.password, dbUser.password)){
                                let token= creaToken(dbUser);
                                //res.setHeader("Authorization",token);
                                writeCookie(res, token);
                                res.send({"Ris":"Ok"});
                            }
                            else{
                                res.status(401).send("Password non valida");
                            }
                        }
                        else
                        {
                            res.status(401).send("Password mancante");
                        }
                    }
                    else
                        res.status(401).send("Username non valido"); //Log dell'errore
                }
            })
        }
    })
})
function creaToken(dbUser){
    let data=Math.floor((new Date()).getTime() / 1000);//GetTime restituisce i millisecondi, dividendo per 1000
    let payload={
        "_id": dbUser._id,
        "username": dbUser.username,
        "iat":dbUser.iat || data,   //initial authentication time
        "exp":data+DURATA_TOKEN
    }
    return jwt.sign(payload,jwtKey);
}
/* ********************** (Sezione 3) USER ROUTES  ************************** */
app.use("/api/",function(req,res,next){
    let token= readCookie(req);
    if(token !=""){
        //JWT.verify inietta il payload del token alla funzione di callback
        jwt.verify(token, jwtKey, function(err,payload){
            if(err)
                res.status(403).send("Unauthorized: token non valido");
            else
            {
                let newToken = creaToken(payload);
                //res.setHeader("authorization",newToken);
                writeCookie(res, newToken);
                req["payload"]=payload;
                next();
            }
        })
    }
    else
    {
        res.status(403).send("Token assente");
    }
})
function readCookie(req){
    let token="";
    if(req.headers.cookie){
        let cookie=req.headers.cookie.split(';');
        for (let item of cookie) {
            item=item.split('=');
            if(item[0].trim()=="token"){
                token=item[1];
                break;
            }
        }
    }
    return token;
}
function writeCookie(res, token){
    //HttpOnly=true -> Fa in modo che i cookie non siano accessibili da Js ma solo da Http
    //Secure=true -> Accesso solo con Https
    //SameSite=false -> Il token viene reso visibile anche su richieste provenienti da pagine non inviate dal server
    let cookie=`token=${token};Max-age=${DURATA_TOKEN};Path=/;HttpOnly=true;Secure=true;SameSite=false;`
    res.setHeader("Set-Cookie",cookie);
}
//Sezione 3 USER ROUTES
//Gestione logout
app.post("/api/logout",function(req,res,next){
    let cookie=`token='';Max-age=-1;Path=/;HttpOnly=true;Secure=true;SameSite=false;`
    res.setHeader("Set-Cookie",cookie);
    res.send({"ris":"ok"}); //Il send serializza lui, quindi non c'è bisogno del .stringify
})
//Gestione elencoMail
app.get("/api/elencoMail",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err)
            res.status(503).send("Errore connessione al database");
        else
        {
            const db=client.db(DBNAME);
            const collection=db.collection("Mail-JWT");
            const _id=req["payload"]._id;
            let oId=new ObjectId(_id);
            let request=collection.findOne({"_id":oId})
            request.then(function(data){
                res.send(data.mail.reverse());
            })
            request.catch(function(data){
                res.status(500).send("Errore esecuzione query");
            })
            request.finally(function(){
                client.close();
            })
        }
    })
})
//Gestione newMail
app.post("/api/newMail",function(req,res,next){
    MongoClient.connect(CONNECTION_STRING,function(err,client){
        if(err)
            res.status(503).send("Errore connessione al database");
        else
        {
            const db=client.db(DBNAME);
            const collection=db.collection("Mail-JWT");
            let mittente=req["payload"].username;
            let mail={
                "from":mittente,
                "subject":req.body.subject,
                "body":req.body.message
            }
            let request=collection.updateOne({"username":req.body.to},{$push:{"mail":mail}})
            request.then(function(data){
                res.send({"ris":"ok"});
            })
            request.catch(function(data){
                res.status(500).send("Errore esecuzione query");
            })
            request.finally(function(){
                client.close();
            })
        }
    })
})
/* ***************** (Sezione 4) DEFAULT ROUTE and ERRORS ******************* */
// gestione degli errori
app.use(function(err, req, res, next) {
    console.log(err.stack); // stack completo    
});
// default route
app.use('/', function(req, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
	else res.send(paginaErrore);
});