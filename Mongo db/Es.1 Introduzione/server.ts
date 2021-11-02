import * as _http from "http";
import HEADERS from "./headers.json"; //Esportazione il file .json
import {Dispatcher} from "./dispatcher"; //Esportazione la classe Dispatcher
import * as _mongodb from "mongodb";
const mongoClient =_mongodb.MongoClient;
//Creazione server http
/*const port: number=1337;
const dispatcher:Dispatcher=new Dispatcher();//Istanzio la classe Dispatcher, così utilizzo dal server tutti i metodi delle classe Dispatcher
const server=_http.createServer(function(req,res) //Routine che risponde alle richieste
{
    dispatcher.dispatch(req,res); //Cuore del sistema: registra nella variabile listeners tutte le richieste del client e fornirle a quest'ultimo
});
server.listen(port);
console.log("Server in ascolto sulla porta "+port);*/
//Registrazione servizi
//Se il server da come risultato undefined, è andato tutto bene
//Modello di accesso al database
const CONNECTIONSTRING="mongodb://127.0.0.1:27017";
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
        let db=client.db("Students");
        let collection=db.collection("Studenti");
        //Record restituiti sotto forma di array enumerativo
        collection.find().toArray(function(err,data){ 
            if(!err)
                console.log("FIND",data);
            else
                console.log("Errore esecuzione query "+err.message);
            client.close();    
        }); 
    }
    else
        console.log("Errore nella connessione al database"+err.message);
});
//Inserimento di un nuovo record
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
        let db=client.db("Students");
        let collection=db.collection("Studenti");
        let student={"Nome":"Fabio","Cognome":"Cavallero","Indirizzo":"Informatica","Hobbies":["Calcio","Basket"],"Lavoratore":false,"Residenza":{"Citta":"Bra","Provincia":"Cuneo","CAP":"12042"}};
        collection.insertOne(student,function(err,data){
            if(!err)
                console.log("INSERT",data);
            else
                console.log("Errore esecuzione query "+err.message);
            client.close(); //Questa istruzione SEMPRE all'interno della callback  
        }); 
    }
    else
        console.log("Errore nella connessione al database"+err.message);
});
//UPDATE
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
        let db=client.db("Students");
        let collection=db.collection("Studenti");
        //Come parametri si aspetta un filtro ed un'azione
        collection.updateOne({"Nome":"Mario"},{$set:{"Residenza":"Fossano"}},(function(err,data){ 
            if(!err)
                console.log("UPDATE",data);
            else
                console.log("Errore esecuzione query "+err.message);
            client.close();    
        })); 
    }
    else
        console.log("Errore nella connessione al database"+err.message);
});
//DELETEMANY
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
        let db=client.db("Students");
        let collection=db.collection("Studenti");
        //Come parametri si aspetta un filtro ed un'azione
        collection.deleteMany({"Residenza":"Fossano"},(function(err,data){ 
            if(!err)
                console.log("DELETEMANY",data);
            else
                console.log("Errore esecuzione query "+err.message);
            client.close();    
        })); 
    }
    else
        console.log("Errore nella connessione al database"+err.message);
});