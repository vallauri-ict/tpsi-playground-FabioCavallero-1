import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
//Import di Mongo
import * as _mongodb from "mongodb";
import cors from "cors";
const mongoClient =_mongodb.MongoClient;
//Connessione ad heroku
const CONNECTIONSTRING= process.env.MONGODB_URI || "mongodb+srv://Fabio:admin@cluster0.mvh5b.mongodb.net/5B?retryWrites=true&w=majority";
const DBNAME = "recipeBook";
let port: number=parseInt(process.env.PORT) || 1337;
let app=express(); //Richiamo il costruttore
let server=http.createServer(app); //Routine che risponde alle richieste
server.listen(port,function(){
    console.log("Server in ascolto sulla porta "+port);
    init();
});
const whitelist = ["http://localhost:4200", "http://localhost:1337", "https://fabio-cavallero-crud-server.herokuapp.com"];
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
//3.Route di lettura dei parametri post
app.use("/",body_parser.json());
app.use("/",body_parser.urlencoded({"extended":true}));
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
    mongoClient.connect(CONNECTIONSTRING,function(err,client){
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
//Lettura delle collezioni presenti nel db, messo sopra al listener GET, sennò non funziona, perchè rispondono quelli sopra
app.get("/api/getCollections",function(req,res,next){
    let db = req["client"].db(DBNAME) as _mongodb.Db;
    let request = db.listCollections().toArray();
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(503).send("Errore esecuzione query");
    })
    request.finally(function(){
        req["client"].close();
    })
});
//Middleware per intercettazione dei parametri
let currentCollection="";
let id="";
// /:id-> facoltativo
app.use("/api/:collection/:id?",(req,res,next) =>{
    currentCollection=req.params.collection;
    id=req.params.id;
    next();
})
//Elenco listener specifici
//Listener GET
app.get("/api/*",function(req,res){
    let db = req["client"].db(DBNAME) as _mongodb.Db; 
    let collection = db.collection(currentCollection);
    if(!id)
    {
        let request = collection.find(req["query"]).toArray();
        request.then(function(data){
            res.send(data);
        });
        request.catch(function(err){
            res.status(503).send("Errore nella sintassi della query")
        });
        request.finally(function(){
            req["client"].close();
        });
    }
    else
    {
        let objectId=new _mongodb.ObjectId(id);
        let request = collection.findOne({"_id":objectId});
        request.then(function(data){
            res.send(data);
        });
        request.catch(function(err){
            res.status(503).send("Errore nella sintassi della query")
        });
        request.finally(function(){
            req["client"].close();
        });
    }
});
//Listener POST
app.post("/api/*",function(req,res){
    let db = req["client"].db(DBNAME) as _mongodb.Db; 
    let collection = db.collection(currentCollection);
    let request = collection.insertOne(req["body"]);
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
app.delete("/api/*",function(req,res){
    let db = req["client"].db(DBNAME) as _mongodb.Db; 
    let collection = db.collection(currentCollection);
    let _id=new _mongodb.ObjectId(id);
    let request = collection.deleteOne({"_id":_id});
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
app.patch("/api/*", function (req, res) {
    let db = req["client"].db(DBNAME) as _mongodb.Db;
    let collection = db.collection(currentCollection);
    let _id = new _mongodb.ObjectId(id);
    let request = collection.updateOne({ "_id": _id }, { "$set": req["BODY"] });
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
 app.put("/api/*", function (req, res) {
    let db = req["client"].db(DBNAME) as _mongodb.Db;
    let collection = db.collection(currentCollection);
    let _id = new _mongodb.ObjectId(id);
    let request = collection.replaceOne({ "_id": _id }, req["BODY"]);
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
//Default route(risponde in caso di risorsa non trovata)
//Route di gestione degli errori
app.use("/",function(err,req,res,next){
    console.log("**************** ERRORE CODICE SERVER ",err.message, " **************");
}) 