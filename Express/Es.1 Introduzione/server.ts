import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser"; 
import { json } from "body-parser";
//Import di Mongo
import * as _mongodb from "mongodb";
const mongoClient =_mongodb.MongoClient;
//Connessione locale
//const CONNECTIONSTRING="mongodb://127.0.0.1:27017";
//Connessione remota
const CONNECTIONSTRING="mongodb+srv://Fabio:admin@cluster0.mvh5b.mongodb.net/5B?retryWrites=true&w=majority";
const DBNAME = "5B";
let port: number=1337;
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
app.use("/",function(req,res,next){ //index.html è implicito
    console.log("----->"+req.method+":"+req.originalUrl);
    next(); //permette di passare al metodo "/" successivo
});
//2.Static route
//dico ad express dove reperire le risorse statiche (index.html)
app.use("/",express.static("./static")); //se non trova la risorsa, il next() avviene in automatico
//3.Route di lettura dei parametri post
app.use("/",body_parser.json()); //Conversione dati in formato json
app.use("/",body_parser.urlencoded({"extended":true})); //parsifico anche le richieste con application/x-www-form-urlencoded
//4.Log parametri
app.use("/",function(req,res,next){
    //Controllo se ci sono delle chiavi, se sì faccio il console.log
    if(Object.keys(req.query).length>0) 
        console.log("          Parametri GET:",req.query);
    if(Object.keys(req.body).length>0)
        console.log("          Parametri BODY: ",req.body);
    next();
})
//Route della creazione della connessione con il db: tutti i listeners fanno 2 cose alternative(next() o risponde al client)
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
//Elenco delle route di risposta al client
//5
app.get("/api/risorsa1",function(req,res){
    let unicorn=req.query.nome;
    if(unicorn){
        let db = req["client"].db(DBNAME) as _mongodb.Db; //as _mongodb.Db -> consigli dell'intelligence (senza questo comando non viene riconosciuta la variabile client)
        let collection = db.collection("Unicorns");
        let request = collection.find({"name":unicorn}).toArray();
        request.then(function(data){
            res.send(data);
        });
        request.catch(function(err){
            res.status(503).send("Errore nella sintassi della query")
        })
        request.finally(function(){
            req["client"].close();
        })
    }
    else
    {
        res.status(400).send("Parametro mancante o non valido");
        req["client"].close();
    }
});
//6
app.patch("/api/risorsa2",function(req,res){
    let unicorn=req.body.nome;
    let incVampires=req.body.vampires;
    if(unicorn && incVampires){
        let db = req["client"].db(DBNAME) as _mongodb.Db; 
        let collection = db.collection("Unicorns");
        let request = collection.updateOne({"name":unicorn},{$inc:{"vampires":incVampires}});
        request.then(function(data){
            res.send(data);
        });
        request.catch(function(err){
            res.status(503).send("Errore nella sintassi della query")
        })
        request.finally(function(){
            req["client"].close();
        })
    }
    else
    {
        res.status(400).send("Parametro mancante o non valido");
        req["client"].close();
    }
});
//7
app.get("/api/risorsa3/:gender/:hair",function(req,res){
    let gender=req.params.gender;
    let hair=req.params.hair;
    //La if sull'esistenza dei parametri in questo caso non serve, perchè se mancano dei parametri non entra manco nella route
    let db = req["client"].db(DBNAME) as _mongodb.Db; 
    let collection = db.collection("Unicorns");
    let request = collection.find({$and:[{"gender":gender},{"hair":hair}]}).toArray();
    request.then(function(data){
        res.send(data);
    });
    request.catch(function(err){
        res.status(503).send("Errore nella sintassi della query")
    })
    request.finally(function(){
        req["client"].close();
    })
});
//Default route(risponde in caso di risorsa non trovata)
app.use("/",function(req,res){
    res.status(404);
    if(req.originalUrl.startsWith("/api/"))
        res.send("Risorsa non trovata");
    else
        res.send(paginaErrore);
}) 
//Route di gestione degli errori
app.use(function(err,req,res,next){
    console.log("Errore codice server",err.message);
}) 