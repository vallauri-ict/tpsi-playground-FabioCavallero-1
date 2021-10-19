import * as _http from "http";
import HEADERS from "./headers.json"; //Esportazione il file .json
import {Dispatcher} from "./dispatcher"; //Esportazione la classe Dispatcher
let port: number=1337;
let dispatcher:Dispatcher=new Dispatcher();//Istanzio la classe Dispatcher, così utilizzo dal server tutti i metodi delle classe Dispatcher
let server=_http.createServer(function(req,res) //Routine che risponde alle richieste
{
    dispatcher.dispatch(req,res); //Cuore del sistema: registra nella variabile listeners tutte le richieste del client e fornirle a quest'ultimo
});
server.listen(port);
console.log("Server in ascolto sulla porta "+port);
//Registrazione servizi
dispatcher.addListener("POST","/api/servizio1",function(req,res)//Definisco il collegamento tra la risorsa richiesta e la funzione che dev'essere eseguita
{
    res.writeHead(200,HEADERS.json); //Intestazione json
    let nome=req["BODY"].nome; //Prendo il campo nome della chiave "BODY"
    res.write(JSON.stringify({"ris":nome, "id":req["GET"].id}));//Ritorno una struttura in formato json corretto
    res.end();
});
dispatcher.addListener("GET","/api/servizio2",function(req,res)
{
    res.writeHead(200,HEADERS.json);
    let nome=req["GET"].nome;//$_REQUEST["GET"]; //"GET"-> chiave oggetto request 
    res.write(JSON.stringify({"ris":nome}));
    res.end();
});