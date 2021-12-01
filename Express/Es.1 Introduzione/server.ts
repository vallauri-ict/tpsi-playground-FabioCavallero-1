import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import { json } from "body-parser";
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
app.use("/",function(req,res,next){
    console.log("----->"+req.method+":"+req.originalUrl);
    next();
});
//2.Static route
app.use("/",express.static("./static")); //se non trova la risorsa, il next() avviene in automatico
//3.Route di lettura dei parametri post
app.use("/",body_parser.json());
app.use("/",body_parser.urlencoded({"extended":true}));
//4.Log parametri
app.use("/",function(req,res,next){
    //Controllo se ci sono delle chiavi, se sì faccio il console.log
    if(Object.keys(req.query).length>0) 
        console.log("Parametri GET:",req.query);
    if(Object.keys(req.body).length>0)
        console.log("Parametri BODY: ",req.body);
    next();
})
//Elenco delle route di risposta al client
app.get("/api/risorsa1",function(req,res){
    let nome=req.query.nome;
    res.send({"nome":nome});
});
app.post("/api/risorsa1",function(req,res){
    let nome=req.body.nome;
    res.send({"nome":nome});
});
//Default route(risponde in caso di risorsa non trovata) e route di gestione degli errori
app.use("/",function(req,res,next){
    res.status(404);
    if(req.originalUrl.startsWith("/api/"))
        res.send("Risorsa non trovata");
    else
        res.send(paginaErrore);
}) 