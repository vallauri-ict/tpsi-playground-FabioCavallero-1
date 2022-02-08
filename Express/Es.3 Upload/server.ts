import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import ENVIRONMENT from "./environment.json";
import cloudinary from "cloudinary";
cloudinary.v2.config({
    cloud_name: ENVIRONMENT.CLOUDINARY.CLOUD_NAME,
    api_key:ENVIRONMENT.CLOUDINARY.API_KEY,
    api_secret: ENVIRONMENT.CLOUDINARY.API_SECRET,
    cloudinary_url:ENVIRONMENT.CLOUDINARY.CLOUDINARY_URL
})
//Import di Mongo
import * as _mongodb from "mongodb";
import cors from "cors";
const mongoClient =_mongodb.MongoClient;
const DBNAME = "5B";
let port: number=parseInt(process.env.PORT) || 1337;
let app=express(); //Richiamo il costruttore
let server=http.createServer(app); //Routine che risponde alle richieste
server.listen(port,function(){
    console.log("Server in ascolto sulla porta "+port);
    init();
});                     //Angular                   //Locale                           //Eroku con https                                   //Eroku con http
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
app.use("/",body_parser.json({"limit":"10mb"}));
app.use("/",body_parser.urlencoded({"extended":true, "limit":"10mb"}));
//4.Log parametri
app.use("/",function(req,res,next){
    //Controllo se ci sono delle chiavi, se sì faccio il console.log
    if(Object.keys(req.query).length>0) 
        console.log("          Parametri GET:",req.query);
    if(Object.keys(req.body).length>0)
        console.log("          Parametri BODY: ",req.body);
    next();
})
//Elenco delle route di risposta al client
//Middleware della creazione della connessione: tutti i listeners fanno 2 cose alternative(next() o risponde al client)
app.use("/",function(req,res,next){
    mongoClient.connect(process.env.MONGODB_URI || ENVIRONMENT.CONNECTION_STRING,function(err,client){
        if(err) 
            res.status(503).send("Errore di connessione al database");
        else
        {
            console.log("Connessione avvenuta con successo");
            req["client"]=client;
            next();
        }
    })
})
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
app.post("/api/cloudinary/", function(req, res, next){
    cloudinary.v2.uploader.upload(req.body.image)
    .catch((error) => {
    res.status(500).send("error uploading file to cloudinary")
    })
    .then((result) => {
        //res.send({"url":result.secure_url})
    })
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