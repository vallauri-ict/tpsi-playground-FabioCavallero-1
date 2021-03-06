//Node.js si aspetta sempre un file javascript  
//Nodemon permette l'esecuzione del file typescript
//nodemon server.ts -> per runnare il file
"use strict" 
import * as _http from "http"; //Importo tutti i moduli della libreria
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
const HEADERS = require("./headers.json") //Qui usiamo la require perchè non abbiamo un modulo, ma un file con un json
const PORT: number = 1337; //Specifichiamo il tipo della variabile
let paginaErrore: string;
var server = _http.createServer(function(req, res) {
    let metodo=req.method;
    let url=_url.parse(req.url,true);
    let risorsa=url.pathname;
    let parametri=url.query;
    console.log(`Richiesta: ${metodo}:${risorsa}, param: ${JSON.stringify(parametri)}`);
    if(risorsa=="/")
        risorsa="/index.html";
    if(!risorsa.startsWith("/api/"))//Se la risorsa inizia con /api/ è un servizio
    {
        risorsa="./static"+risorsa;
        _fs.readFile(risorsa,function(error,data){
            if(!error){
                let header={ "Content-Type": _mime.getType(risorsa)};
                res.writeHead(200,header);
                res.write(data);
                res.end();
            }
            else
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
        res.write(JSON.stringify(json));
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
        if(!errore)
            paginaErrore=data.toString();
        else
            paginaErrore="<h1>Pagina non trovata</h1>";
    });
});
console.log("Server in esecuzione sulla porta "+PORT);