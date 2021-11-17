import * as _http from "http";
import HEADERS from "./headers.json"; //Esportazione il file .json
import {Dispatcher} from "./dispatcher"; //Esportazione la classe Dispatcher
import * as _mongodb from "mongodb";
const mongoClient =_mongodb.MongoClient;
const CONNECTIONSTRING="mongodb://127.0.0.1:27017";
const DBNAME = "5B";
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
    let dataStart=req["BODY"].dataStart; //Prendo il campo nome della chiave "BODY"
    let dataEnd=req["BODY"].dataEnd;
    //Query 1
    mongoClient.connect(CONNECTIONSTRING,function(err,client){
        if(!err)
        {
          let db = client.db(DBNAME);
          let collection = db.collection("vallauri");
          //I nomi dei campi devono essere sempre preceduti dal "$" se sono usati come valore a destra dei ":"
          collection.find({"$and":[{"$gte":{"dob":dataStart}},{"$lte":{"dob":dataEnd}}]})
          .project({"nome":1, "classe":1})
          .toArray(function(err,data){
              if(!err){
                  res.writeHead(200, HEADERS.json);
                  res.write(JSON.stringify(data));
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
        else{
            console.log("Errore nella connessione al DB " + err.message);
        }
      });
});