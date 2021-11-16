import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const COLLECTION_NAME="Orders";
const COLLECTION_NAME2="Unicorns";
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
//Query 3
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME2);
      let req = collection.aggregate([
        {"$match":{"gender":{"$exists":true}}}, //Match deve essere prima di group, perchè al contrario gli altri campi sarebbero tutti cancellati tranne id e totale
        {"$group":{"_id":"$gender","totale":{"$sum":1}}}
      ]).toArray();
      req.then(function(data){
          console.log("Query 3",data);
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
//Query 4
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME2);
      let req = collection.aggregate([
        {"$match":{"gender":{"$exists":true}}},
        {"$group":{"_id":{"gender":"$gender"},"mediaVampiri":{"$avg":"$vampires"}}}
      ]).toArray();
      req.then(function(data){
          console.log("Query 4",data);
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
//Query 5
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME2);
      let req = collection.aggregate([
        {"$match":{"gender":{"$exists":true}}}, 
        {"$group":{"_id":{"gender":"$gender","hair":"$hair"},"nEsemplari":{"$sum":1}}},
        {"$sort":{"nEsemplari":-1,"_id":-1}}
      ]).toArray();
      req.then(function(data){
          console.log("Query 5",data);
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
//Query 6
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME2);
      let req = collection.aggregate([
        {"$match":{"gender":{"$exists":true}}}, 
        {"$group":{"_id":{"gender":"$gender","hair":"$hair"},"nEsemplari":{"$sum":1}}},
        {"$sort":{"nEsemplari":-1,"_id":-1}}
      ]).toArray();
      req.then(function(data){
          console.log("Query 6",data);
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