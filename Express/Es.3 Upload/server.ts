import * as http from "http";
import * as fs from "fs";
import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import * as _mongodb from "mongodb"; // MongoDB
import fileUpload, { UploadedFile } from "express-fileupload";
import ENVIRONMENT from "./environment.json";
import cloudinary, { UploadApiResponse } from "cloudinary";
//Configurazione Cloudinary
cloudinary.v2.config({
    cloud_name: ENVIRONMENT.CLOUDINARY.CLOUD_NAME,
    api_key:ENVIRONMENT.CLOUDINARY.API_KEY,
    api_secret: ENVIRONMENT.CLOUDINARY.API_SECRET,
})
const mongoClient =_mongodb.MongoClient;
const DBNAME = "5B";
let port: number=parseInt(process.env.PORT) || 1337;
let app=express(); //Richiamo il costruttore
let server=http.createServer(app); //Routine che risponde alle richieste
server.listen(port,function(){
    console.log("Server in ascolto sulla porta "+port);
    init();
});
let paginaErrore="";
function init()
{
    fs.readFile("./static/error.html",function(err,data){
        if(!err)
            paginaErrore=data.toString();
        else
            paginaErrore="<h2>Risorsa non trovata</h2>";    
    });
}
//Elenco delle route di tipo middleware
//1.Log
app.use("/",function(req,res,next){
    console.log("----->"+req.method+":"+req.originalUrl);
    next();
});
//2.Static route
//Express.static -> restituisce la risorsa statica
app.use("/",express.static("./static")); //se non trova la risorsa, il next() avviene in automatico
//3.Route di lettura dei parametri post con impostazione del limite immagini base64
app.use("/",bodyParser.json({"limit":"10mb"}));
app.use("/",bodyParser.urlencoded({"extended":true, "limit":"10mb"}));
//4.Log parametri
app.use("/",function(req,res,next){
    //Controllo se ci sono delle chiavi, se sì faccio il console.log
    if(Object.keys(req.query).length>0) 
        console.log("          Parametri GET:",req.query);
    if(Object.keys(req.body).length>0)
        console.log("          Parametri BODY: ",req.body);
    next();
})
//5.Middleware cors, gestisce le richieste cross origin
                         //Angular                  //Locale                           //Eroku con https                                   //Eroku con http
const whitelist = ["http://localhost:4200", "http://localhost:1337", "https://fabio-cavallero-crud-server.herokuapp.com", "http://fabio-cavallero-crud-server.herokuapp.com"];
const corsOptions = {
 origin: function(origin, callback) {
 if (!origin)
 return callback(null, true);
 if (whitelist.indexOf(origin) === -1) {
 var msg = 'The CORS policy for this site does not ' +
 'allow access from the specified Origin.';
 return callback(new Error(msg), false);
 }
 else
 return callback(null, true);
 },
 credentials: true
};
app.use("/", cors(corsOptions));
// 6. binary fileUpload: gestione dimensione massima dei file da caricare
app.use(fileUpload({
    "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
}));
//Elenco delle route di risposta al client
//Middleware della creazione della connessione: tutti i listeners fanno 2 cose alternative(next() o risponde al client)
app.use("/", function (req, res, next) {
    mongoClient.connect(process.env.MONGODB_URI || ENVIRONMENT.CONNECTION_STRING, function (err, client) {
        if (err) {
            res.status(503).send("Errore nella connessione al DB");
        }
        else {
            console.log(">>>>>> Connected succesfully");
            req["client"] = client;
            next();
        }
    });
});
//Elenco listener specifici
//Listener GET
app.get("/api/images",function(req,res){
    let db = req["client"].db(DBNAME) as _mongodb.Db; 
    let collection = db.collection("images");
    let request = collection.find().toArray();
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(503).send("Errore nella sintassi della query")
    });
    request.finally(function(){
        req["client"].close();
    });
});    
//Listener POST
app.post("/api/uploadBinary", function (req, res, next) {
    let db = req["client"].db(DBNAME) as _mongodb.Db;
    let collection = db.collection("images");
    if (!req.files || Object.keys(req.files).length == 0 || !req.body.username)
        res.status(400).send('Username o immagine mancante');
    else {
        let _file = req.files.img as UploadedFile;
        _file.mv('./static/img/' + _file["name"], function (err) {
            if (err)
                res.status(500).json(err.message);
            else {
                let user = {
                    "username": req.body.username,
                    "img": _file.name
                }
                let request = collection.insertOne(user);
                request.then(function (data) {
                    res.send(data);
                });
                request.catch(function (err) {
                    res.status(503).send("Errore esecuzione query");
                })
                request.finally(function () {
                    req["client"].close();
                })
            }
        })
    }
});
app.post("/api/uploadBase64", function (req, res, next) {
    let db = req["client"].db(DBNAME) as _mongodb.Db;
    let collection = db.collection("images");
    let request = collection.insertOne(req.body);
    request.then(function (data) {
        res.send(data);
    });
    request.catch(function (err) {
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function () {
        req["client"].close();
    })
});
app.post("/api/cloudinaryBase64", function (req, res, next) {
    cloudinary.v2.uploader.upload(req.body.image, { "folder": "Ese03 - Upload" })
        .catch((error) => {
            res.status(500).send("Errore nel caricamento del file su cloudinary");
        })
        .then((result: UploadApiResponse) => {
            //res.send({"url":result.secure_url}) 
            let db = req["client"].db(DBNAME) as _mongodb.Db;
            let collection = db.collection("images");
            let user = {
                "username": req.body.username,
                "img": result.secure_url
            }
            let request = collection.insertOne(user);
            request.then(function (data) {
                res.send(data);
            });
            request.catch(function (err) {
                res.status(503).send("Errore esecuzione query");
            })
            request.finally(function () {
                req["client"].close();
            })
        })
})
app.post("/api/cloudinaryBinario", function (req, res, next) {
    if (!req.files || Object.keys(req.files).length == 0 || !req.body.username)
      res.status(400).send('Manca immagine o username');
    else {
      let file = req.files.img as UploadedFile;
      let path = './static/img/' + file["name"];
      file.mv(path, function (err) {
        if (err){
          res.status(500).json(err.message);
        }
        else {
          cloudinary.v2.uploader.upload(path, { "folder": "Ese03 - Upload", use_filename: true })
          .catch((error) => {
            res.status(500).send("error uploading file to cloudinary")
          })
          .then((result: UploadApiResponse) => {
            //res.send({"url":result.secure_url})
            let db = req["client"].db(DBNAME) as _mongodb.Db;
            let collection = db.collection("images");
            let user = {
              "username": req.body.username,
              "img": file.name
            }
            let request = collection.insertOne(user);
            request.then((data) => {
              res.send(data);
            });
            request.catch((err) => {
              res.status(503).send("Sintax error in the query");
            });
            request.finally(() => {
              req["client"].close();
            });
          })
        }
      })
    }
  })
//Default route(risponde in caso di risorsa non trovata)
app.use("/", function (req, res, next) {
    res.status(404);
    res.send("Risorsa non trovata");
});   
//Route di gestione degli errori
app.use("/",function(err,req,res,next){
    console.log("**************** ERRORE CODICE SERVER ",err.message, " **************");
})