import * as _http from "http";
import {HEADERS} from "./headers";
import {Dispatcher} from "./dispatcher";
import {persons} from "./persons";
let port: number=1337;
let dispatcher :Dispatcher= new Dispatcher();
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
    let nazione :string= req["GET"].nazione; //Get -> contiene tutti i parametri get;  Body-> contiene tutti gli altri parametri
    let vetPersons:object[]=[]; /*Va bene anche senza :object[], Non cambia nulla*/
    for (const person of persons.results) {
        if (person.location.country==nazione) {
            let jsonPerson:object={ 
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
dispatcher.addListener("PATCH","/api/dettagli",function(req,res){
    let personRequested=req["BODY"].person;
    let trovato=false;
    let person;
    for (person of persons.results) 
    {
        if ((person.name.title + " " + person.name.first + " "+ person.name.last)==personRequested) 
        {
            trovato=true;
            break;
        }  
    }
    if (trovato) 
    {
        res.writeHead(200,HEADERS.json);
        res.write(JSON.stringify(person));
        res.end();
    }
    else
    {
        res.writeHead(404,HEADERS.text);
        res.write("Persona non trovata");
        res.end();
    }
});
dispatcher.addListener("DELETE","/api/elimina",function(req,res){
    let personRequested=req["BODY"].person;
    let trovato=false;
    let i;
    for (i=0;i<persons.results.length;i++) 
    {
        if ((persons.results[i].name.title + " " + persons.results[i].name.first + " "+ persons.results[i].name.last)==personRequested) 
        {
            trovato=true;
            break;
        }   
    }
    if (trovato) 
    {
        persons.results.splice(i,1);
        res.writeHead(200,HEADERS.json); /*Quando mandiamo indietro 200, deve essere sempre .json (json serializzato)*/
        res.write(JSON.stringify("Record cancellato correttamente"));
        res.end();
    }
    else
    {
        res.writeHead(404,HEADERS.text);
        res.write("Persona non trovata");
        res.end();
    }
});