import * as _http from "http";
let HEADERS= require("./headers.json");
let dispatcher=require("./dispatcher.ts");
let persons = require("./persons.json");
let port: number=1337;
let server=_http.createServer(function(req,res) //Routine che risponde alle richieste
{
    dispatcher.dispatch(req,res); //Cuore del sistema
});
server.listen(port);
console.log("Server in ascolto sulla porta "+port);
//Registrazione servizi
dispatcher.addListener("GET","/api/nazioni",function(req,res)
{
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
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify({"nazioni": nazioni}));
    res.end();
});
dispatcher.addListener("GET","/api/persone",function(req,res)
{
    let nazione = req["GET"].nazione; //Get -> contiene tutti i parametri get;  Body-> contiene tutti gli altri parametri
    let vetPersons:object[]=[]; /*Va bene anche senza :object[]*/ 
    for (const person of persons.results) {
        if (person.location.country==nazione) {
            let jsonPerson:object={ /*Non cambia nulla*/
                "name":person.name.title + " " + person.name.first + " "+ person.name.last,
                "city":person.location.city,
                "state":person.location.state,
                "cell":person.cell
            };
            vetPersons.push(jsonPerson);
        }
    }
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(vetPersons));
    res.end();
});