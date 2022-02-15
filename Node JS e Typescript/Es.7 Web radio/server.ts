import * as http from "http";
import * as fs from "fs";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
let dispatcher:Dispatcher = new Dispatcher();
const PORT:number = 1337;
let server = http.createServer((req:any, res:any) => {
    dispatcher.dispatch(req, res);
});
server.listen(PORT);
console.log("Server in ascolto sulla porta " + PORT);
//Registrazione servizi
dispatcher.addListener("GET", "/api/elenco", (req, res) => {
    fs.readFile("./states.json", (err, data) => {
        if (err) {
            console.error("ERROR: " + err);
        } else {
            let regioni = [];
            for (const item of JSON.parse(data.toString())) {
                regioni.push(item.name);
            }
            res.writeHead(200, HEADERS.json);
            res.end(JSON.stringify({
                "regioni": regioni,
            }));
        }
    });
});
dispatcher.addListener("POST", "/api/radios", (req, res) => {
    let param = req["BODY"].name;
    fs.readFile("./radios.json", (err, data) => {
        if (err) {
            console.error("ERROR: " + err);
        } else {
            let radios = [];
            for (const radio of JSON.parse(data.toString())) {
                if (radio.state == param) {
                    radios.push(radio);                    
                }
            }
            res.writeHead(200, HEADERS.json);
            res.end(JSON.stringify({
                "radios": radios, 
            }));
        }
    });
});
dispatcher.addListener("POST", "/api/like", (req, res) => {
    let param = req["BODY"].id;
    fs.readFile("./radios.json", (err, data) => {
        if (err) {
            console.error("ERROR: " + err);
        } else {
            for (const radio of JSON.parse(data.toString())) {
                if (radio.id == param) {
                    radio.votes = (parseInt(radio.votes) + 1).toString();                    
                    fs.writeFile("./radios.json", JSON.stringify(JSON.parse(data.toString())), (err) => {
                        if (err) {
                            res.writeHead(500, HEADERS.text);
                            res.end(JSON.stringify("File non salvato correttamente"));
                        } else {
                            res.writeHead(200, HEADERS.text);
                            res.end(JSON.stringify("File salvato correttamente"));
                        }
                    });
                    break;
                }
            }
            res.writeHead(500, HEADERS.text);
            res.end(JSON.stringify("Id non trovato"));
        }
    });
});