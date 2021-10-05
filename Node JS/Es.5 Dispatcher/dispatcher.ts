/*Dispatcher -> sezione del Web server che si occupa di gestire le richieste che arrivano dal client*/
import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
import * as _querystring from "query-string";
let HEADERS= require("./headers.json");
let paginaErrore : string;
class Dispatcher{
    prompt:string=">>> "
    //Ogni listeners è costituito da un json del tipo {"risorsa":callback}; sono suddivisi in base al metodo di chiamata
    listeners:any={ //Any -> Qualunque tipo
        "GET":{},
        "POST":{},
        "DELETE":{},
        "PUT":{},
        "PATCH":{}
    } 
    constructor()
    {
        init();
    }
    addListener(metodo:string,risorsa:string,callback:any)
    {
        metodo=metodo.toUpperCase(); 
        if (this.listeners[metodo]) //Usare sempre il this in questi casi
        { 
            this.listeners[metodo][risorsa]=callback; //Creazione di una chiave con valore callback
        }
        else
        {
            throw new Error("Metodo non valido come stringa");
        }
        //Seconda soluzione
        /*if(metodo in this.listeners){}*/
    }
    dispatch(req,res)
    {
        let metodo=req.method.toUpperCase();
        if(metodo="GET")
        {
            innerDispatch(req,res); //Se si tratta di una funzione esterna, il ".this" non ci vuole
        }
        else
        {
            let parametriBody="";
            req.on("data", function(data)
            {
                parametriBody +=data;
            })
            let parametriJSON={};
            req.on("end",function(){
                try{
                    //Se i parametri sono in formato JSON, la conversione va a buon fine, altrimenti significa che sono URL-ENCODED e passo nel catch
                    parametriJSON=JSON.parse(parametriBody);
                }
                catch(error)
                {
                    parametriJSON=_querystring.parse(parametriBody);
                }
            })
        }
    }
}
function innerDispatch(req,res)
{
    //Lettura di metodo risorsa e parametri
    let metodo=req.method;
    let url=_url.parse(req.url,true);
    let risorsa=url.pathname;
    let parametri=url.query;
    req["GET"]=parametri;
    console.log(`${this.prompt} ${metodo}: ${risorsa} ${JSON.stringify(parametri)}`);
    if (risorsa.startsWith("/api/")) //Se la richiesta inizia per "/api/", si tratta di un servizio, altrimenti, si tratta di una pagina
    {
        if(risorsa in this.listeners[metodo])
        {
            let _callback=this.listeners[metodo][risorsa];
            _callback(req,res); //Lancio in esecuzione la callback interna a listeners
        }    
        else
        {
            //Il client si aspett un JSON: in caso di errore, al posto del JSON, restituiamo una stringa
            res.writeHead(404,HEADERS.text);
            res.write("Servizio non trovato");
            res.end();
        }
    }
    else
    {
        staticListener(req,res,risorsa);
    }
}  
function staticListener(req,res,risorsa)
{
    if(risorsa=="/")
    {
        risorsa="/index.html";
    }
    let fileName="./static"+risorsa; // risorse -> iniziano con /  nomi dei file -> iniziano con ./
    _fs.readFile(fileName,function (err,data) 
    {
        if(!err)
        {
            let header={"Content-Type":_mime.getType(fileName)};
            res.writeHead(200,header);
            res.write(data);
            res.end();
        }    
        else //Il client si aspetta una pagina
        {
            console.log(`${err.code}: ${err.message}`);
            res.writeHead(404,HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
}
function init() 
{
    _fs.readFile("./static/error.html",function(err,data)
    {
        if(!err)
        {
            paginaErrore=data.toString();
        }
        else
        {
            paginaErrore="<h1>Pagina non trovata</h1>";
        }
    });    
}
module.exports=new Dispatcher();