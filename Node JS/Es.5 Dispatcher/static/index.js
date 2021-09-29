$(document).ready(function() {
    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("post", "/api/servizio1", {"nome":"pippo"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("post", "/api/servizio2", {"nome":"pluto"}); //Servizio 2 non viene trovato, perchè non gestito
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
});
