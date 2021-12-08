import { group } from 'console';
import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const COLLECTION_NAME="Orders";
const COLLECTION_NAME2="Unicorns";
const COLLECTION_NAME3="Quizzes";
const COLLECTION_NAME4="Students";
//Query 1 somma di più campi
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME);
    //I nomi dei campi devono essere sempre preceduti dal "$" se sono usati come valore a destra dei ":"
    let req= collection.aggregate([ //aggregate -> consente di eseguire query di selezione più complesse
      {$match:{"status":"A"}}, //$match -> identifica tutti i record con la chiave ed il valore indicato
      {$group:{"_id":"$cust_id","totale":{$sum:"$amount"}}},//$group-> raggruppa in 1 solo record dei record che hanno LO STESSO custId e somma nel record complessivo i rispettivi amount 
      //Il recordset risultante avrà solo 2 colonne che sono _id e totale: tutti gli altri campi non sono visibili: abbiamo solo quelli che chiediamo nella group
      {$sort:{"amount":-1}}
    ]).toArray();
    //Dopo l'aggregate si stampa la query se è andata a buon fine
    req.then(function (data) {
		console.log("Query 1", data);
	});
    //Stampa il messaggio d'errore se la query non è andata a buon fine
	req.catch(function (err) {
		console.log("Errore esecuzione query: " + err.message);
	});
    //Chiudo la connessione indipendentemente dal risultato della query
	req.finally(function () {
		client.close();
	});
    }
    else
      console.log("Errore connessione al db: "+err.message);
});
//Query 2 media
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      let req = collection.aggregate([
          {$group:{
              "_id":"$cust_id", 
              "avgAmount":{$avg:"$amount"},
              "avgTotal":{$avg:{$multiply:["$qta","$amount"]}} //Media di qta ed aumount moltiplicati fra loro
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
  else
      console.log("Errore nella connessione al DB " + err.message);
});
//Query 3 conteggio degli unicorni maschi e degli unicorni femmina
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME2);
      let req = collection.aggregate([
        //Con $exists:true -> vengono presi tutti gli unicorni con il campo gender 
        {$match:{"gender":{$exists:true}}}, //Match deve essere prima di group, perchè al contrario gli altri campi sarebbero tutti cancellati tranne id e totale
        //Totale -> campo creato dinamicamente
        {$group:{"_id":"$gender","totale":{$sum:1}}}//$sum-> incremento ogni volta di 1
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
  else
      console.log("Errore nella connessione al DB " + err.message);
});
//Query 4 calcolare il numero medio di vampiri uccisi dagli unicorni femmina e dagli unicorni maschi
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME2);
      let req = collection.aggregate([
        {$match:{"gender":{$exists:true}}},
        {$group:{"_id":{"gender":"$gender"},"mediaVampiri":{$avg:"$vampires"}}}
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
  else
      console.log("Errore nella connessione al DB " + err.message);
});
//Query 5 raggruppare gli unicorni per genere e tipo di pelo
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME2);
      let req = collection.aggregate([
        {$match:{"gender":{$exists:true}}}, 
        {$group:{"_id":{"gender":"$gender","hair":"$hair"},"nEsemplari":{$sum:1}}},
        {$sort:{"nEsemplari":-1,"_id":-1}} //Ordine alfabetico decrescente in caso di parità
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
//Query 6 numero medio di vampiri uccisi dagli unicorni complessivamente presenti nella collezione
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME2);
      let req = collection.aggregate([ 
        //Id vuoto, perchè dobbiamo prenderli tutti e non possiamo identificare univocamente tutti gli unicorni  
        {$group:{"_id":{},"media":{$avg:"$vampires"}}},
        {$project:{"_id":0,"media":1}}
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
  else
      console.log("Errore nella connessione al DB " + err.message);
});
//Query 7 varie medie
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME3);
      let req = collection.aggregate([
        //Le funzioni di aggregazione($avg,$round) usate dentro project lavorano sui campi del singolo record
        {$project:{ //Aggregazione orizzontale, lavora su un singolo record
        "quizAvg":{$avg:"$quizzes"}, //I nomi a sinistra li scegliamo noi, quelli dentro le graffe sono i valori dei campi
        "labAvg":{$avg:"$labs"},
        "examAvg":{$avg:["$midterm","$final"]}
        }},
        {$project:{
          "quizAvg":{$round:["$quizAvg",1]}, //Approsimazione decimale, 1 -> 1 numero dopo la virgola
          "labAvg":{$round:["$labAvg",1]},
          "examAvg":{$round:["$examAvg",1]}
        }},
        //Media delle medie
        {$group:{ //Aggregazione verticale, lavora su più record
          "_id":{},
          "mediaQuiz":{$avg:"$quizAvg"},
          "mediaLab":{$avg:"$labAvg"},
          "mediaExam":{$avg:"$examAvg"}
        }},
        {$project:{
          "mediaQuiz":{$round:["$mediaQuiz",2]}, 
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
//Query 8 individuare nome e codice del secondo studente femmina con la media più alta
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME4);
      let regex = new RegExp("f","i");
      let req = collection.aggregate([
         //$match -> find dell'aggregate
        {$match:{"genere":{"$regex":regex}}},  //Oppure  {$match:{"genere":"f"}},
        {$project:{"genere":1,"nome":1,"mediaVoti":{$avg:"$voti"}}},
        {$sort:{"mediaVoti":-1}}, //L'id si autoincrementa
        {$limit:2},
        {$skip:1}
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
  else
      console.log("Errore nella connessione al DB " + err.message);
});
//Query 9 somma di elementi di un vettore
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME);
      let req = collection.aggregate([
        {$project:{"status":1,"nDettagli":1}},
        {$unwind:"$nDettagli"}, //Divide il vettore in n parti, per facilitarne l'elaborazione
        {$group:{"_id":"$status","sommaDettagli":{$sum:"$nDettagli"}}}
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
  else
      console.log("Errore nella connessione al DB " + err.message);
});
//Seconda soluzione
mongoClient.connect(CONNSTRING,function(err,client){
    if(!err){
        let db = client.db(DBNAME);
        let collection = db.collection(COLLECTION_NAME);
        let req = collection.aggregate([
          {$project:{"status":1,"nDettagli": {$sum:"$nDettagli"}}},
          {$group:{"_id":"$status","sommaDettagli":{$sum:"$nDettagli"}}}
        ]).toArray();
        req.then(function(data){
            console.log("Query 9 seconda soluzione",data);
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
//Query 10 persone nate dopo il 2000 compreso
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err){
      let db = client.db(DBNAME);
      let collection = db.collection(COLLECTION_NAME4);
      //$expr -> permette di fare confronti tra chiavi diverse
      let req = collection.find({$expr:{$gte:[{$year:"$nato"},2000]}}).toArray(); //$year -> prende solo l'anno
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
  else
      console.log("Errore nella connessione al DB " + err.message);
});
//Query 11 trovare il peso medio degli unicorni femmina ed il peso medio degli unicorni maschi
mongoClient.connect(CONNSTRING,function(err,client){
if(!err){
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME2);
    let req = collection.aggregate([
        {$group:{
            "_id":"$gender",
            "pesoMedio":{$avg:"$weight"}
        }},
    ]).toArray();
    req.then(function(data){
        console.log("Query 11",data);
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
//Query 12 considerando soltanto gli unicorni che amano le mele, trovare il numero di vampiri complessivamente uccisi dagli unicorni maschi ed il numero di vampiri complessivamente uccisi dagli unicorni femmina
mongoClient.connect(CONNSTRING,function(err,client){
if(!err){
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME2);
    let req = collection.aggregate([
        {$match:{"loves":"apple"}},
        {$group:{
            "_id":"$gender",
            "totaleVampiriUccisi":{$sum:"$vampires"}
        }},
    ]).toArray();
    req.then(function(data){
        console.log("Query 12",data);
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
//Query 13 visualizzare i nomi dei frutti più amati dagli unicorni, in ordine di preferenza
mongoClient.connect(CONNSTRING,function(err,client){
if(!err){
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME2);
    let req = collection.aggregate([
        {$unwind:"$loves"},
        {$group:{
            "_id":"$loves",
            "totaleLoves":{$sum:1}
        }},
        {$sort:{"totaleLoves":-1}},
        {$limit:3}
    ]).toArray();
    req.then(function(data){
        console.log("Query 13",data);
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
//Query 14 valutare la media dei voti di ogni studente e poi la media delle medie degli studenti raggruppati per classe. Visualizzare la media delle classi, solo per le classi con media > 6
mongoClient.connect(CONNSTRING,function(err,client){
if(!err){
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME4);
    let req = collection.aggregate([
        {$project:{
            "classe":1,
            "mediaVoti":{$avg:"$voti"}
        }},
        {$group:{ 
            "_id":"$classe",
            "mediaTotale":{$avg:"$mediaVoti"}
        }},
        {$match:{$expr:{$gt:["$mediaTotale",6]}}},
        {$sort:{"mediaTotale":-1}}
    ]).toArray();
    req.then(function(data){
        console.log("Query 14",data);
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
//Query 15 elenco degli studenti non ancora maggiorenni
mongoClient.connect(CONNSTRING,function(err,client){
if(!err){
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME4);
    let req = collection.aggregate([
        {$match:{$expr:{$gt:[{$year:"$nato"},2003]}}},
        {$project:{
            "_id":0,
            "nome":1
        }}
    ]).toArray();
    req.then(function(data){
        console.log("Query 15",data);
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
//Query 16 elenco degli studenti nati in un certo anno
mongoClient.connect(CONNSTRING,function(err,client){
if(!err){
    let db = client.db(DBNAME);
    let collection = db.collection(COLLECTION_NAME4);
    let req = collection.aggregate([
        //eq -> equal
        {$match:{$expr:{$eq:[{$year:"$nato"},2000]}}},
        {$project:{
            "_id":0,
            "nome":1
        }}
    ]).toArray();
    req.then(function(data){
        console.log("Query 16",data);
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