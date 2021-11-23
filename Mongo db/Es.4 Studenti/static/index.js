$(document).ready(function() {
    $("#dataStart").val("");
    $("#dataEnd").val("");
    let _tbody = $("#tbody");
    $("#btnInvia").on("click", function() {
    let dataStart = $("#dataStart").val();
    let dataEnd = $("#dataEnd").val();
        let request = inviaRichiesta("post", "/api/servizio1", {"dataStart":dataStart,"dataEnd":dataEnd});
        request.fail(errore);
        request.done(function(data) {
            _tbody.empty();
            for (const student of data) {
                let tr = $("<tr>");
                tr.appendTo(_tbody);
                let td = $("<td>").appendTo(tr).text(student.nome);
                td = $("<td>").appendTo(tr).text(student.classe);
            }
        });
    });
});