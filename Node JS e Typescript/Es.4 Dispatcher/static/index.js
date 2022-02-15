$(document).ready(function() {
    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("POST", "/api/servizio1?id=5", {"nome":"pippo"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("GET", "/api/servizio2", {"nome":"pluto"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
});
