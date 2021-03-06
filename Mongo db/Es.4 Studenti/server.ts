import * as _http from "http";
import HEADERS from "./headers.json"; //Esportazione il file .json
import {Dispatcher} from "./dispatcher"; //Esportazione la classe Dispatcher
import * as _mongodb from "mongodb";
const mongoClient =_mongodb.MongoClient;
const CONNECTIONSTRING="mongodb://127.0.0.1:27017";
const DBNAME = "5B";
let port: number=1337;
let dispatcher:Dispatcher=new Dispatcher();//Istanzio la classe Dispatcher, così utilizzo dal server tutti i metodi della classe Dispatcher
let server=_http.createServer(function(req,res) //Routine che risponde alle richieste
{
    dispatcher.dispatch(req,res); //Cuore del sistema: registra nella variabile listeners tutte le richieste del client e fornirle a quest'ultimo
});
server.listen(port);
console.log("Server in ascolto sulla porta "+port);
//Registrazione servizi
dispatcher.addListener("POST","/api/servizio1",function(req,res)//Definisco il collegamento tra la risorsa richiesta e la funzione che dev'essere eseguita
{
    let dataStart=new Date(req["BODY"].dataStart); //Prendo il campo nome della chiave "BODY"
    let dataEnd=new Date(req["BODY"].dataEnd);
    //Query 1 trovare tutti gli studenti nati tra due date
    mongoClient.connect(CONNECTIONSTRING,function(err,client){
        if(!err)
        {
          let db = client.db(DBNAME);
          let collection = db.collection("vallauri");
          collection.find({$and:[{"dob":{$gte:dataStart,$lte:dataEnd}}]})
          .project({"nome":1, "classe":1})
          .toArray(function(err,data){
              if(!err){
                  res.writeHead(200, HEADERS.json);
                  res.write(JSON.stringify(data)); //Stringify perchè i dati devono essere sempre spediti come stringa
                  res.end();
              }
              else{
                  res.writeHead(500, HEADERS.text);
                  res.write("Errore esecuzione della query");
                  res.end();
              }
              client.close();
          });
        }
        else
            console.log("Errore nella connessione al DB " + err.message);
      });
});