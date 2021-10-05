import * as _http from "http";
let HEADERS= require("./headers.json");
let dispatcher=require("./dispatcher.ts");
let port: number=1337;
let server=_http.createServer(function(req,res) //Routine che risponde alle richieste
{
    dispatcher.dispatch(req,res); //Cuore del sistema
});
server.listen(port);
console.log("Server in ascolto sulla porta "+port);
//Registrazione servizi
dispatcher.addListener("POST","/api/servizio1",function(req,res)
{
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify({"ris":"ok"}));
    res.end();
});
dispatcher.addListener("GET","/api/servizio2",function(req,res)
{
    res.writeHead(200,HEADERS.json);
    let nome=req["GET"].nome;
    res.write(JSON.stringify({"ris":nome}));
    res.end();
});