"use strict" 
const _http = require("http");
const _url = require("url");
const _fs = require("fs"); //fs->File system, perchè vogliamo accedere ad un preciso file per poi leggerlo
const HEADERS = require("./headers.json")
const _mime = require("mime");//Libreria che restituisce il tipo di risorsa
const PORT = 1337;
let paginaErrore;
var server = _http.createServer(function(req, res) {
    let metodo=req.method;
    let url=_url.parse(req.url,true);
    let risorsa=url.pathname;
    let parametri=url.query;
    console.log(`Richiesta: ${metodo}:${risorsa}, param: ${JSON.stringify(parametri)}`);//Il console.log funziona solo nel debug di VS
    if(risorsa=="/")
        risorsa="/index.html";
    if(!risorsa.startsWith("/api/")) //Se nell'url è presente /api/ è perchè viene richiesta una risorsa dinamica, altrimenti è statica
    {
        risorsa="./static"+risorsa;
        _fs.readFile(risorsa,function(error,data){ //Error e data sono gestiti dal fs
            if(!error) //Il server ha letto correttamente il file
            {
                let header={ "Content-Type": _mime.getType(risorsa)};
                res.writeHead(200,header);
                res.write(data); //Data -> contenuto risorsa
                res.end();
            }
            else //Il file non è presente o la sua sintassi è errata
            {
                res.writeHead(404,HEADERS.html);
                res.write(paginaErrore);
                res.end();
            }
        });
    }
    else if(risorsa == "/api/servizio1")//Gestione servizio1
    {
        let json={"ris":"ok"};
        res.writeHead(200,HEADERS.json);
        res.write(JSON.stringify(json)); //Quando devo inviare degli oggetti è bene fare lo stringify
        res.end();
    }
    else
    {
        res.writeHead(404,HEADERS.text);
        res.write("Servizio richiesto inesistente");
        res.end();
    }
});
server.listen(PORT,function(){
    _fs.readFile("./static/error.html",function(errore,data){
        if(!errore)//Restuisco la pagina errore come la abbiamo impostata
            paginaErrore=data;
        else //Restituisco un altro errore
            paginaErrore="<h1>Pagina non trovata</h1>";
    });
});
console.log("Server in esecuzione sulla porta "+PORT);