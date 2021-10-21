$(document).ready(function() {
    let lstRegioni = $("#lstRegioni");
    let tbody = $("#tbody");
    let request = inviaRichiesta("GET", "/api/elenco");
    request.fail(errore);
    request.done(function(data) {
        console.log(data);
        for (const regione of data.regioni) {
            $("<option>").val(regione).text(regione).appendTo(lstRegioni);
        }
    });
    lstRegioni.on("change", () => {
        console.log(lstRegioni.val());
        let request = inviaRichiesta("POST", "/api/radios", { "name": lstRegioni.val() });
        request.fail(errore);
        request.done(function(data) {
            console.log(data);
            for (const radio of data.radios) {
                let tr = $("<tr>").prop("radio", radio);
                tr.appendTo(tbody);
                tr.append($("<td>").append($("<img>").prop("src", radio.favicon).css("width", "40px")));
                tr.append($("<td>").text(radio.name));
                tr.append($("<td>").text(radio.codec));
                tr.append($("<td>").text(radio.bitrate));
                tr.append($("<td>").text(radio.votes));
                tr.append($("<td>").append($("<img>").prop("src", "like.jpg").css("width", "40px").on("click", like)));
            }
        });
    });
});
function like() {
    let this_id = $(this).parent().parent().prop("radio").id;
    let request = inviaRichiesta("POST", "/api/like", { "id": this_id });
    request.fail(errore);
    request.done(function(data) {
        console.log(data);
    });
}