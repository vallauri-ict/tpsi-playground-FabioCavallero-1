$(document).ready(function() {
    //2 servizi possono avere lo stesso nome solo se hanno 2 chiamate differenti (GET e POST)
    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("GET", "/api/risorsa1", {"nome":"Kenny"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("PATCH", "/api/risorsa2", {"nome":"Unico","vampires":3});
        request.fail(errore);
        request.done(function(data) {
            if(data.modifiedCount>0)
                alert("Aggiornamento eseguito correttamente");
            else
                alert("Nessuna corrispondenza trovata");
        });
    });
    $("#btnInvia3").on("click", function() {
        let request = inviaRichiesta("GET", "/api/risorsa3/m/brown");
        request.fail(errore);
        request.done(function(data) {
            console.log(data);
        });
    });
});