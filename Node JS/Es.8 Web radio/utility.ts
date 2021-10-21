import * as _fs from "fs";
import HEADERS from "./headers.json";
// lettura file states.json
import radios from "./radios.json";
_fs.readFile("./states.json", (err, data) => {
    if (err) {
        console.error("ERROR: " + err);
    } else {
        // data è il contenuto del file espresso in forma binaria
        // se il file contiene del testo è necessario fare un .toString()
        // finale
        // console.log(data.toString());
        elabora(JSON.parse(data.toString()));
    }
});
function elabora(states) {
    for (const state of states) {
        for (const radio of radios) {
            if (radio.state == state.name) {
                state.stationcount = parseInt(state.stationcount) + 1;
                state.stationcount = (state.stationcount).toString();
            }
        }
    }
    _fs.writeFile("./states.json", JSON.stringify(states), (err) => {
        if (err) {
            console.error("ERROR: " + err);
        } else {
            console.log("file salvato correttamente");
        }
    });
}