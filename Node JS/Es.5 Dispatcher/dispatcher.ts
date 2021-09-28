import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
let HEADERS= require("headers.json");
let paginaErrore : string;
class Dispatcher{
    prompt:string=">>>"
    //Ogni listeners è costituito da un json del tipo {"risorsa":callback}; sono suddivisi in base al metodo di chiamata
    listeners:any={ //Any -> Qualunque tipo
        "GET":{},
        "POST":{},
        "DELETE":{},
        "PUT":{},
        "PATCH":{}
    } 
    constructor(){}
    addListener(metodo:string,risorsa:string,callback:any){
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
}