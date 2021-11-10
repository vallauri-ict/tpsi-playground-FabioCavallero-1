import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const COLLECTION_NAME= "Unicorns";
//Esecuzione delle query asincrona
//Query 1
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //Andiamo ad accedere al database
    let db = client.db(DBNAME);
    //Prendiamo tramite il metodo collection l'elemento unicorns
    let collection = db.collection(COLLECTION_NAME);
    //Trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({"weight" : {$lte:800,$gte:700}}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 1: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$and:[{"loves" : "grape"},{"vampires" : {$gt:60}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 2: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 3
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$or:[{"gender" : "f"},{"weight" : {$lt:700}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 3: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 4
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$and:[{"loves":{$in:["apple","grape"]}},{"vampires":{$gt:60}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 4: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 5
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$and:[{"loves":{$all:["grape","watermelon"]}},{"vampires":{$gt:60}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 5: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 6 A
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$or:[{hair : "grey"},{hair : "brown"}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 6 A: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 6 B
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({hair:{$in:["brown","grey"]}}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 6 B: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 7
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$and:[{vaccinated:{$exists:true}},{vaccinated : true}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 7: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
// Query 8
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      collection.find({"$and":[{"loves":{"$nin":["apple"]}},{"gender":"m"}]}).toArray(function(err,data){
          if(!err){
              console.log("Query 8",data);
          }
          else{
              console.log("Errore esecuzione query " + err.message);
          }
          client.close();
      });
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});
//Query 9
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    let regex = new RegExp("^A","i")
    collection.find({$and:[{name:regex},{gender:"f"}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 9: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 10
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({_id:new _mongodb.ObjectId("61823943699b9dda310fd39e")}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 10: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 11 A
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({gender : "m"}).project({"name": 1, "vampires": 1}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 11 A: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 11 B
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({gender : "m"}).project({name: 1, vampires: 1}).sort({vampires: -1, name: 1}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 11 B: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 11 C
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({gender : "m"}).project({name: 1, vampires: 1}).sort({vampires: -1, name: 1}).limit(3).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 11 C: " , data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 12
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({weight:{$gt:500}}).count(function(err,data){
      if(!err)
      {
        console.log("Query 12: Ci sono " + data + " unicorni più pesanti di 500 kg");
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});
//Query 13
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.findOne({name:"Aurora"},{projection: {weight:1, hair:1}},function(err,data){
      if(!err)
      {
        console.log("Query 13: Ci sono " + data + " unicorni più pesanti di 500 kg");
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})
//Query 14
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.distinct("loves",{gender:"F"},function(err,data){
      if(!err)
      {
        console.log("Query 14",data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})
//Query 15
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.insertOne({"name":"pippo","gender":"m","loves":["apple","lemon"]},function(err,data){
      if(!err)
      {
        console.log("Query 15 A",data);
        collection.deleteMany({"name":"pippo"},(err,data)=>{}); //Arrow function: metodo alternativo a function(err,data)
      }
      else
      {
        console.log("Query 15 B",data);
      }
      client.close(); //Quando ci sono più query annidate, si chiude la connessione nella query più interna
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})
//Query 16
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //{"upsert":true} -> Se il record da aggiornare non esiste, viene automaticamente creato
    collection.updateOne({"loves":"pilot"},{"$inc":{"vampires":1}},{"upsert":true},function(err,data){
      if(!err)
      {
        console.log("Query 16",data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})
//Query 17
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.updateOne({name:"Aurora"},{"$addToSet":{"loves":"carote"},"$inc":{"weight":10}},function(err,data){
      if(!err)
      {
        console.log("Query 17: Ci sono " + data + " unicorni più pesanti di 500 kg");
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})
//Query 18
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.updateOne({"name":"minnie"},{"$inc":{"vampires":1}},{"upsert":true},function(err,data){
      if(!err)
      {
        console.log("Query 18",data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})
//Query 19
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.updateMany({vaccinated: {"$exists":false}},
    {"$set":{"vaccinated":true}},
    function(err,data){
      if(!err)
      {
        console.log("Query 19",data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})
//Query 20
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.deleteMany({"loves":{"$all":['grape','carrot']}},function(err,data){
      if(!err)
      {
        console.log("Query 20",data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})
//Query 21
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      collection.find({"gender":"f"}).sort({"vampires":-1}).limit(1).project({"name":1,"vampires":1,"_id":0}).toArray(function(err,data){
          if(!err)
          {
              console.log("Query 21",data);
          }
          else{
              console.log("Errore esecuzione query " + err.message);
          }
          client.close();
      });
  }
  else{
      console.log("Errore nella connessione al DB " + err.message);
  }
});
//Query 22
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //replaceOne() -> cancella tutti i campi del record trovato non inseriti
    collection.replaceOne({"name":"pluto"},{"name":"pluto","residenza":"fossano","loves":"apple"},function(err,data){
      if(!err)
      {
        console.log("Query 22",data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})