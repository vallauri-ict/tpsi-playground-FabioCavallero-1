import * as _mongodb from "mongodb"; //Classe mongo
const mongoClient =_mongodb.MongoClient; //Client x connessione al db
//Modello di accesso al database
//Se il server da come risultato undefined, è andato tutto bene
const CONNECTIONSTRING="mongodb://127.0.0.1:27017";
//Query 4 find di più record
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
        let db=client.db("5B");
        let collection=db.collection("Students"); //Collection -> tabelle del db
        //Record restituiti sotto forma di array enumerativo: controllo che la collezione sia presente nel db
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
//Query 2 insert di un record
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
        let db=client.db("5B");
        let collection=db.collection("Students");
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
//Query 3 update di un record
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
        let db=client.db("5B");
        let collection=db.collection("Students");
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
//Query 4 delete di più record
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
        let db=client.db("5B");
        let collection=db.collection("Students");
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