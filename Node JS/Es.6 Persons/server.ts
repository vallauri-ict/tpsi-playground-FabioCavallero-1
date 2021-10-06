import * as _http from "http";
let HEADERS= require("./headers.json");
let dispatcher=require("./dispatcher.ts");
import * as persons from './persons.json';
let port: number=1337;
let server=_http.createServer(function(req,res) //Routine che risponde alle richieste
{
    dispatcher.dispatch(req,res); //Cuore del sistema
});
server.listen(port);
console.log("Server in ascolto sulla porta "+port);
//Registrazione servizi
dispatcher.addListener("GET","/api/Nazioni",function(req,res)
{
    res.writeHead(200,HEADERS.json);
    let nazioni=[];
    for (const person of persons["results"]) 
    {
        if (!nazioni.includes(person.location.country)) 
        {
            nazioni.push(person.location.country);   
        }   
    }
    //Ordinamento
    nazioni.sort();
    res.write(JSON.stringify({"nazioni":nazioni}));
    res.end();
});