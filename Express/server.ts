process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Per far sì che funga
import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
//Import di Mongo
import * as _mongodb from "mongodb";
import cors from "cors"; //per le richieste cross origins
import nodemailer from "nodemailer";
const mongoClient = _mongodb.MongoClient;
import ENVIRONMENT from "./environment.json";
//Connessione ad heroku
const CONNECTIONSTRING = process.env.MONGODB_URI ||"mongodb+srv://Fabio:admin@cluster0.mvh5b.mongodb.net/5B?retryWrites=true&w=majority";
const DBNAME = "recipeBook";
let port: number = parseInt(process.env.PORT) || 1337;
let app = express(); //Richiamo il costruttore
let server = http.createServer(app); //Routine che risponde alle richieste
server.listen(port, function () {
	console.log("Server in ascolto sulla porta " + port);
	init();
});
//Apertura delle restrinzioni cors a qualunque client
const corsOptions = {
	origin: function(origin, callback) {
	return callback(null, true);
	},
	credentials: true
   };
   app.use("/", cors(corsOptions));
let paginaErrore = "";
let message='';
function init() {
	fs.readFile("./static/error.html", function (err, data) {
		if (!err) 
			paginaErrore = data.toString();
		else 
			paginaErrore = "<h2>Risorsa non trovata</h2>";
	});
	fs.readFile("./message.html", function (err, data) {
		if (!err) 
			message = data.toString();
	});
}
//Elenco delle route di tipo middleware
//1.Log
app.use("/", function (req, res, next) {
	console.log("----->" + req.method + ":" + req.originalUrl);
	next();
});
//2.Static route
//Express.static -> restituisce la risorsa statica
app.use("/", express.static("./static")); //se non trova la risorsa, il next() avviene in automatico
//3.Route di lettura dei parametri post
app.use("/", body_parser.json());
app.use("/", body_parser.urlencoded({ extended: true }));
//4.Log parametri
app.use("/", function (req, res, next) {
	//Controllo se ci sono delle chiavi, se sì faccio il console.log
	if (Object.keys(req.query).length > 0)
		console.log("          Parametri GET:", req.query);
	if (Object.keys(req.body).length > 0)
		console.log("          Parametri BODY: ", req.body);
	next();
});
//Elenco delle route di risposta al client
let transporter=nodemailer.createTransport({"service":"gmail","auth":ENVIRONMENT.MAIL_CREDENTIALS})
app.post("/api/newMail",function(req,res,next){
	let msg=message.replace("__user","pippo").replace("__password","pippo");
	let mailOptions={
		"from":ENVIRONMENT.MAIL_CREDENTIALS.user,
		"to":req.body.to,
		"subject":req.body.subject,
		//"text":msg} No formattazione html
		"html":msg, //Sì formattazione
		//Inserimento allegato con filename che vedrà il ricevente
		"attachments":[{"filename":"qrCode.png", "path":"./qrCode.png"}]
	}
	transporter.sendMail(mailOptions,function(err,data){
		if(!err)
			res.send({"ris":"ok"});
		else
			res.status(500).send("Errore invio mail: "+err.message);
	})
});
//Default route(risponde in caso di risorsa non trovata)
app.use("/", function (req, res, next) {
    res.status(404);
    if(req.originalUrl.startsWith("/api/")){
        res.send("Risorsa non trovata");
    }
    else{
        res.send(paginaErrore);
    }
});
//Route di gestione degli errori
app.use("/", function (err, req, res, next) {
	console.log("**************** ERRORE CODICE SERVER ",err.stack," **************");
});