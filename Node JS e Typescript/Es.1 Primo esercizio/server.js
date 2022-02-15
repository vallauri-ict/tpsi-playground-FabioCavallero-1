//headers.json -> Elenco di intestazioni
//Il ? serve per ripassare la risorsa dai parametri, l'& per aggiungere altri parametri
//La favIcon viene richiesta già in automatico
const _http = require("http"); //Libreria
const _url = require("url"); //Idem
const _colors=require("colors"); //Idem
const HEADERS = require("./headers.json") // "./" -> Cartella corrente
const port = 1337; //Porta da cui faremo partire node js
//Creazione web server: la funzione di callback viene eseguita ad ogni richiesta del client
const server=_http.createServer(function (req, res) {
    /* Prima prova:
    res.writeHead(200, HEADERS.text); //Scrittura intestazione
    res.write("Richiesta eseguita correttamente"); //Scrittura risposta
    res.end(); //Invio risposta
    console.log("Richiesta eseguita");*/
    let metodo=req.method; //Tipo di metodo (GET,POST,...);
    //Parsing della URL ricevuta
    let url=_url.parse(req.url,true); //Trasformo da stringa ad oggetto: true di default come secondo parametro
    let risorsa=url.pathname; //L'informazione che vogliamo che il server ci restituisca
    let parametri=url.query; //Campi dopo la risorsa
    let dominio=req.headers.host; //La parte dopo http://
    res.writeHead(200, HEADERS.html);//Restituisce una pagina html
    res.write("<h1> Informazioni relative alla richiesta ricevuta </h1>");
    res.write("<br>");
    res.write(`<p> <b> Risorsa richiesta: </b> ${risorsa} </p>`); //Alt 96, per l'apice: quando dobbiamo inserire delle variabili, usare questo apice
    res.write(`<p> <b> Metodo: </b> ${metodo} </p>`);
    res.write(`<p> <b> Parametri: </b> ${JSON.stringify(parametri)} </p>`);//Trasformo la query string in un oggetto JSON, con i parametri il .stringify è obbligatorio
    res.write(`<p> <b> Dominio richiesto: </b> ${dominio} </p>`);
    res.write("<p> Grazie per la richesta </p>");
    res.end();
    console.log("Richiesta ricevuta: "+req.url.yellow);
});
//Se non si specifica l'indirizzo IP di ascolto, il server viene avviato su tutte le interfacce
server.listen(port);//Il programma termina, ma il server rimane in esecuzione
console.log("server in ascolto sulla porta " + port);