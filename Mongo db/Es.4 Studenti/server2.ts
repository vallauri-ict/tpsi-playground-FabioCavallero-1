import * as _mongodb from "mongodb";
const mongoClient =_mongodb.MongoClient;
const CONNECTIONSTRING="mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const COLLECTION_NAME="vallauri";
//Query 2
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      collection.aggregate([
          {$project:{
           "mediaItaliano":{$avg:"$italiano"},
           "mediaInformatica":{$avg:"$informatica"},
           "mediaMatematica":{$avg:"$matematica"},
           "mediaSistemi":{$avg:"$sistemi"},
           "classe":1
        }},
        {$project:{
            //Calcolo media di più chiavi
            "mediaStudente":{$avg:["$mediaItaliano","$mediaInformatica","$mediaMatematica","$mediaSistemi"]},
            "classe":1
        }},
        {$group:{
            "_id":"$classe",
            "mediaClasse":{$avg:"$mediaStudente"}
        }},
        {$sort:{
            "mediaClasse":-1
        }},
        {$project:{
            "mediaClasse":{$round:["$mediaClasse",2]}
        }}
    ]).toArray(function(err,data){
    if(!err)
        console.log("Query 2" , data);
    else
        console.log("errore esecuzione query " + err.message);
        client.close();
    });
    }
    else
        console.log("Errore nella connessione al DB " + err.message);
});
//Query 3
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      collection.updateMany({$and:[{"genere":"f","classe":"4A"}]},{$push:{"informatica":7 as never}},function(err,data){
    if(!err)
        console.log("Query 3" , data);
    else
        console.log("errore esecuzione query " + err.message);
        client.close();
    });
    }
    else
        console.log("Errore nella connessione al DB " + err.message);
});
//Query 4
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      collection.deleteMany({"classe":"3B","sistemi":{"$in":[5]}},function(err,data){
    if(!err)
        console.log("Query 4" , data);
    else
        console.log("errore esecuzione query " + err.message);
        client.close();
    });
    }
    else
        console.log("Errore nella connessione al DB " + err.message);
});
//Query 5
mongoClient.connect(CONNECTIONSTRING,function(err,client){
    if(!err)
    {
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      collection.aggregate([
        {$group:{
            "_id":"$classe",
            "assenzeTotali":{$sum:"$assenze"}
        }},
         {$sort:{"assenzeTotali":-1}}
      ]).toArray(function(err,data){
    if(!err)
        console.log("Query 5" , data);
    else
        console.log("errore esecuzione query " + err.message);
        client.close();
    });
    }
    else
        console.log("Errore nella connessione al DB " + err.message);
});