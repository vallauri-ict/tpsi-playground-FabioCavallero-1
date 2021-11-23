import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const COLLECTION_NAME= "Unicorns";
//Esecuzione delle query asincrona, il risultato delle query è sempre ritornato all'interno di un vettore
//{"chiave":"valore"}
//Query 1
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //Andiamo ad accedere al database
    let db = client.db(DBNAME);
    //Prendiamo tramite il metodo collection l'elemento unicorns
    let collection = db.collection(COLLECTION_NAME);
    //Trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({"weight" : {$gte:700,$lte:800}}).toArray(function(err,data){//Find == select, $gte -> >=  $lte -> <=
      if(!err)
        console.log("Query 1",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$and:[{"gender":"m"},{"loves":"grape"},{"vampires" : {$gt:60}}]}).toArray(function(err,data){ //gt -> > lt-> <
      if(!err)
        console.log("Query 2" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 3
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$or:[{"gender" : "f"},{"weight" : {$lt:700}}]}).toArray(function(err,data){
      if(!err)
        console.log("Query 3" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 4
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$and:[{"loves":{$in:["apple","grape"]}},{"vampires":{$gt:60}}]}).toArray(function(err,data){ //$in -> contiene uno dei 2
      if(!err)
        console.log("Query 4" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 5
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //Mettere 'watermelon' perchè 'apple' non è mai presente con 'grape'
    collection.find({$and:[{"loves":{$all:["grape","apple"]}},{"vampires":{$gt:60}}]}).toArray(function(err,data){ // $all -> contiene tutti
      if(!err)
        console.log("Query 5" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 6
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$or:[{"hair" : "grey"},{"hair" : "brown"}]}).toArray(function(err,data){
      if(!err)
        console.log("Query 6" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Seconda soluzione
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({"hair":{$in:["brown","grey"]}}).toArray(function(err,data){
      if(!err)
        console.log("Query 6 seconda soluzione" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 7
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({$and:[{"vaccinated":{$exists:true}},{"vaccinated" : true}]}).toArray(function(err,data){
      /*Soluzione alternativa:
      collection.find({"vaccinated" : true}).toArray(function(err,data){};*/
      if(!err)
        console.log("Query 7" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
// Query 8
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.updateMany({"vaccinated": {$exists:false}},{$set:{"vaccinated":false}},
    function(err,data){
      if(!err)
        console.log("Query 8",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
})
//Query 9
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    let regex = new RegExp("^A","i"); //Cerco il nome che inizia con 'A'
    collection.find({$and:[{"name":regex},{"gender":"f"}]}).toArray(function(err,data){
      if(!err)
        console.log("Query 9" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 10
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({"_id":new _mongodb.ObjectId("619a663b6de8a731a4f5c7a3")}).toArray(function(err,data){
      if(!err)
        console.log("Query 10" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 11 A
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //Project -> visualizza, 1->serve per visualizzare un determinato campo
    collection.find({gender : "m"}).project({"name": 1, "vampires": 1}).toArray(function(err,data){
      if(!err)
        console.log("Query 11 A" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 11 B
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //.sort({vampires: -1, name: 1}) -> ordinamento decrescente per vampiri e crescente per nome(ordine alfabetico in caso di parità) 
    collection.find({gender : "m"}).project({name: 1, vampires: 1}).sort({vampires: -1, name: 1}).toArray(function(err,data){
      if(!err)
        console.log("Query 11 B" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 11 C
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //.limit(3) -> visualizzazione dei primi 3 record
    collection.find({gender : "m"}).project({name: 1, vampires: 1}).sort({vampires: -1, name: 1}).limit(3).toArray(function(err,data){
      if(!err)
        console.log("Query 11 C" , data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 12
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.find({"weight":{$gt:500}}).count(function(err,data){
      if(!err)
        console.log("Query 12: Ci sono " + data + " unicorni più pesanti di 500 kg");
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
});
//Query 13
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //Projection == project
    collection.findOne({"name":"Aurora"},{projection: {"weight":1, "hair":1}},function(err,data){
      if(!err)
        console.log("Query 13:",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
})
//Query 14
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //distinct -> visualizza senza ripetizioni
    collection.distinct("loves",{"gender":"f"},function(err,data){
      if(!err)
        console.log("Query 14",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
    //Non c'è il .toArray(), perchè ho un vettore di stringhe, non di oggetti
  }
  else
    console.log("Errore nella connessione al database");
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
        console.log("Query 15 A (inserimento)",data);
        collection.deleteMany({"name":"pippo"},(err,data)=>{//Arrow function: metodo alternativo a function(err,data)
          if(!err)
            console.log("Query 15 B (cancellazione)",data);
          else
            console.log("errore esecuzione query 15 B" + err.message);
          client.close(); //Quando ci sono più query annidate, si chiude la connessione nella query più interna
        }); 
      }
      else
        console.log("errore esecuzione query 15 A" + err.message);
      });
  }
  else
    console.log("Errore nella connessione al database");
})
//Query 16
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //{"upsert":true} -> Se il record da aggiornare non esiste, viene automaticamente creato
    collection.updateOne({"name":"Pilot"},{$inc:{"vampires":1}},{"upsert":true},function(err,data){ //$inc-> incrementa
      if(!err)
        console.log("Query 16",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
})
//Query 17
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //addToSet-> aggiunge all'insieme attuale il valore specificato
    collection.updateOne({name:"Aurora"},{$addToSet:{"loves":"carote"},$inc:{"weight":10}},function(err,data){
      if(!err)
        console.log("Query 17",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
})
//Query 18
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.updateOne({"name":"Pluto"},{"$inc":{"vampires":1}},{"upsert":true},function(err,data){
      if(!err)
        console.log("Query 18",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
})
//Query 19
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    collection.deleteMany({"loves":{$all:['grape','carrot']}},function(err,data){
      if(!err)
        console.log("Query 19",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
})
//Query 20
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      //nel .project, 1 -> visualizza quel determinato campo  0 -> non visualizza 
      collection.find({"gender":"f"}).sort({"vampires":-1}).limit(1).project({"name":1,"vampires":1,"_id":0}).toArray(function(err,data){
          if(!err)
            console.log("Query 20",data);
          else
            console.log("Errore esecuzione query " + err.message);
          client.close();
      });
  }
  else
    console.log("Errore nella connessione al DB " + err.message);
});
//Query 21
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //replaceOne() -> cancella tutti i campi del record trovato non inseriti nel nuovo inserimento e sostituisce i campi già presenti con i valori dei campi nuovi
    collection.replaceOne({"name":"Pluto"},{"name":"Gianni","residenza":"fossano","loves":"apple"},function(err,data){
      if(!err)
        console.log("Query 21",data);
      else
        console.log("errore esecuzione query " + err.message);
      client.close();
    });
  }
  else
    console.log("Errore nella connessione al database");
})
//Query 22
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      //$nin -> che non ha quel determinato valore
      collection.find({$and:[{"loves":{$nin:["apple"]}},{"gender":"m"}]}).toArray(function(err,data){
          if(!err)
            console.log("Query 22",data);
          else
            console.log("Errore esecuzione query " + err.message);
          client.close();
      });
  }
  else
      console.log("Errore nella connessione al DB " + err.message);
});