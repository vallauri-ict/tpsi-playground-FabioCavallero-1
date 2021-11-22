import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const COLLECTION_NAME="Orders";
const COLLECTION_NAME2="Unicorns";
const COLLECTION_NAME3="Quizzes";
const COLLECTION_NAME4="Students";
//Query 1
// mongoClient.connect(CONNSTRING,function(err,client){
//   if(!err)
//   {
//     let db = client.db(DBNAME);
//     let collection = db.collection(COLLECTION_NAME);
//     //I nomi dei campi devono essere sempre preceduti dal "$" se sono usati come valore a destra dei ":"
//     let req= collection.aggregate([ //aggregate -> consente di eseguire query di selezione più complesse
//       {$match:{"status":"A"}}, //$match -> identifica tutti i record con la chiave ed il valore indicato
//       {$group:{"_id":"$cust_id","totale":{$sum:"$amount"}}},//$group-> raggruppa in 1 solo record dei record che hanno LO STESSO il custId e somma nel record complessivo i rispettivi amount 
//       //Il recordset risultante avrà solo 2 colonne che sono _id e totale: tutti gli altri campi non sono visibili: abbiamo solo quelli che chiediamo nella group
//       {$sort:{"amount":-1}}
//     ]).toArray();
//     //Dopo l'aggregate si stampa la query se è andata a buon fine
//     req.then(function (data) {
// 		console.log("Query 1", data);
// 	});
//     //Stampa il messaggio d'errore se la query non è andata a buon fine
// 	req.catch(function (err) {
// 		console.log("Errore esecuzione query: " + err.message);
// 	});
//     //Chiudo la connessione indipendentemente dal risultato della query
// 	req.finally(function () {
// 		client.close();
// 	});
//     }
//     else
//       console.log("Errore connessione al db: "+err.message);
// });
//Query 2
// mongoClient.connect(CONNSTRING,function(err,client){
//   if(!err){
//       let db = client.db(DBNAME);
//       let collection = db.collection(COLLECTION_NAME);
//       let req = collection.aggregate([
//           {$group:{
//               "_id":"$cust_id", 
//               "avgAmount":{$avg:"$amount"},
//               "avgTotal":{$avg:{$multiply:["$qta","$amount"]}} //Media di qta ed aumount moltiplicati fra loro
//           }}
//       ]).toArray();
//       req.then(function(data){
//           console.log("Query 2",data);
//       });
//       req.catch(function(err){
//           console.log("Errore esecuzione query " + err.message);
//       })
//       req.finally(function(){
//           client.close();
//       })
//   }
//   else
//       console.log("Errore nella connessione al DB " + err.message);
// });
//Query 3
// mongoClient.connect(CONNSTRING,function(err,client){
//   if(!err){
//       let db = client.db(DBNAME);
//       let collection = db.collection(COLLECTION_NAME2);
//       let req = collection.aggregate([
//         //Con $exists:true -> vengono presi tutti gli unicorni con il campo gender 
//         {$match:{"gender":{$exists:true}}}, //Match deve essere prima di group, perchè al contrario gli altri campi sarebbero tutti cancellati tranne id e totale
//         //Totale -> campo creato dinamicamente
//         {$group:{"_id":"$gender","totale":{$sum:1}}}//$sum-> incremento ogni volta di 1
//       ]).toArray();
//       req.then(function(data){
//           console.log("Query 3",data);
//       });
//       req.catch(function(err){
//           console.log("Errore esecuzione query " + err.message);
//       })
//       req.finally(function(){
//           client.close();
//       })
//   }
//   else
//       console.log("Errore nella connessione al DB " + err.message);
// });
//Query 4
// mongoClient.connect(CONNSTRING,function(err,client){
//   if(!err){
//       let db = client.db(DBNAME);
//       let collection = db.collection(COLLECTION_NAME2);
//       let req = collection.aggregate([
//         {$match:{"gender":{$exists:true}}},
//         {$group:{"_id":{"gender":"$gender"},"mediaVampiri":{$avg:"$vampires"}}}
//       ]).toArray();
//       req.then(function(data){
//           console.log("Query 4",data);
//       });
//       req.catch(function(err){
//           console.log("Errore esecuzione query " + err.message);
//       })
//       req.finally(function(){
//           client.close();
//       })
//   }
//   else
//       console.log("Errore nella connessione al DB " + err.message);
// });
//Query 5
// mongoClient.connect(CONNSTRING,function(err,client){
//   if(!err){
//       let db = client.db(DBNAME);
//       let collection = db.collection(COLLECTION_NAME2);
//       let req = collection.aggregate([
//         {$match:{"gender":{$exists:true}}}, 
//         {$group:{"_id":{"gender":"$gender","hair":"$hair"},"nEsemplari":{$sum:1}}},
//         {$sort:{"nEsemplari":-1,"_id":-1}} //Ordine alfabetico decrescente in caso di parità
//       ]).toArray();
//       req.then(function(data){
//           console.log("Query 5",data);
//       });
//       req.catch(function(err){
//           console.log("Errore esecuzione query " + err.message);
//       })
//       req.finally(function(){
//           client.close();
//       })
//   }
//   else{
//       console.log("Errore nella connessione al DB " + err.message);
//   }
// });
//Query 6
// mongoClient.connect(CONNSTRING,function(err,client){
//   if(!err){
//       let db = client.db(DBNAME);
//       let collection = db.collection(COLLECTION_NAME2);
//       let req = collection.aggregate([ 
//         //Id vuoto, perchè dobbiamo prenderli tutti e non possiamo identificare univocamente tutti gli unicorni  
//         {$group:{"_id":{},"media":{$avg:"$vampires"}}},
//         {$project:{"_id":0,"media":1}}
//       ]).toArray();
//       req.then(function(data){
//           console.log("Query 6",data);
//       });
//       req.catch(function(err){
//           console.log("Errore esecuzione query " + err.message);
//       })
//       req.finally(function(){
//           client.close();
//       })
//   }
//   else
//       console.log("Errore nella connessione al DB " + err.message);
// });
//Query 7
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME3);
      let req = collection.aggregate([
        //Le funzioni di aggregazione usate dentro project lavorano sui campi del singolo record
        {$project:{
        "quizAvg":{$avg:"$quizzes"}, //I nomi a sinistra li scegliamo noi, quelli dentro le graffe sono i valori dei campi
        "labAvg":{$avg:"$labs"},
        "examAvg":{$avg:["$midterm","$final"]}
        }},
        {$project:{
          "quizAvg":{$round:["$quizAvg",1]}, //Approsimazione decimale
          "labAvg":{$round:["$labAvg",1]},
          "examAvg":{$round:["$examAvg",1]}
        }},
        {$group:{
          "_id":{},
          "mediaQuiz":{$avg:"$quizAvg"},
          "mediaLab":{$avg:"$labAvg"},
          "mediaExam":{$avg:"$examAvg"}
        }},
        {$project:{
          "mediaQuiz":{$round:["$mediaAvg",2]}, 
          "mediaLab":{$round:["$mediaLab",2]},
          "mediaExam":{$round:["$mediaExam",2]}
        }}
      ]).toArray();
      req.then(function(data){
          console.log("Query 7",data);
      });
      req.catch(function(err){
          console.log("Errore esecuzione query " + err.message);
      })
      req.finally(function(){
          client.close();
      })
  }
  else
      console.log("Errore nella connessione al DB " + err.message);
});
//Query 8
/*
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME4);
      let regex = new RegExp("f","i");
      let req = collection.aggregate([
        {"$project":{"genere":1,"nome":1,"mediaVoti":{"$avg":"$voti"}}},
        {"$match":{"gender":{"$regex":regex}}},  
        {"$sort":{"mediaVoti":-1}}, //L'id si autoincrementa
        {"$skip":1},
        {"$limit":1}
      ]).toArray();
      req.then(function(data){
          console.log("Query 8",data);
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
//Query 9
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      let regex = new RegExp("f","i");
      let req = collection.aggregate([
        {"$project":{"status":1,"nDettagli":1}},
        {"$unwind":"$nDettagli"},
        {"$group":{"_id":"$status","sommaDettagli":{"$sum":"$nDettagli"}}}
      ]).toArray();
      req.then(function(data){
          console.log("Query 9",data);
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
//Query 10
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME4);
      let req = collection.find({"$expr":{"$gte":[{"$year":"$nato"},2000]}}).toArray();
      req.then(function(data){
          console.log("Query 10",data);
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
});*/