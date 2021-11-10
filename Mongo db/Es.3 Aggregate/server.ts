import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const COLLECTION_NAME="Orders";
//Query 1
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //I nomi dei campi devono essere sempre preceduti dal "$" se sono usati come valore a destra dei ":"
    let req= collection.aggregate([
      {"$match":{"status":"A"}},
      {"$group":{"_id":"$cust_id","totale":{"$sum":"$amount"}}},//Dopo aver fatto i gruppi con "$group", il recordset risultante avrà solo 2 colonne che sono _id e totale: tutti gli altri campi non sono visibili
      {"$":{"totale":-1}}
    ]).toArray();
    req.then(function(data){
        console.log("Query 1: " , data);
      });
      req.catch(function(err){
        console.log("Errore esecuzione query: "+err.message);
      });
      req.finally(function(){
        client.close();
      });
    }
    else{
      console.log("Errore connessione al db: "+err.message);
    }
});
//Query 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      let req = collection.aggregate([
          {"$group":{
              "_id":"$cust_id", 
              "avgAmount":{"$avg":"$amount"},
              "avgTotal":{"$avg":{"$multiply":["$qta","$amount"]}}
          }}
      ]).toArray();
      req.then(function(data){
          console.log("Query 2",data);
      });
      req.catch(function(err){
          console.log("Errore esecuzione query " + err.message);
      })
      req.finally(function(){
          client.close();
      })
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});