import _express from "express";
import * as _http from "http";
import HEADERS from "./headers.json"; //Esportazione del file .json
let port: number=1337;
let app=_express(); //Richiamo il costruttore
let server=_http.createServer(app); //Routine che risponde alle richieste
server.listen(port,function(){console.log("Server in ascolto sulla porta "+port)});
//Elenco delle routes(listeners)
app.use("*",function(req,res,next){
    console.log("----->"+req.method+":"+req.originalUrl);
    next();
});
app.get("*",function(req,res,next){
    res.send("This is the response");
});