"use strict"
$(document).ready(function() {
    let filters=$(".card").first();
    let divIntestazione = $("#divIntestazione")
    let divCollections = $("#divCollections")
    let table = $("#mainTable")
    let divDettagli = $("#divDettagli")
    filters.hide();
    let currentCollection = "";
    let request = inviaRichiesta("GET", "/api/getCollections");
    request.fail(errore)
    request.done(function(collections) {
        let label = divCollections.children("label");
        for (const collection of collections) {
            let clone = label.clone();
            clone.appendTo(divCollections);
            clone.children("span").text(collection.name);
            clone.children("input").val(collection.name);
            divCollections.append("<br>");
        }
        label.remove();
    })
    divCollections.on("click","input[type=radio]",function(){
        currentCollection=$(this).val(); //Nome collezione
        let request=inviaRichiesta("GET","/api/"+currentCollection);
        request.fail(errore);
        request.done(function(data){
            divIntestazione.find("strong").eq(0).text(currentCollection);
            divIntestazione.find("strong").eq(1).text(data.length);
            if (currentCollection=="Unicorns") 
                filters.show();
            else
                filters.hide();
            table.children("tbody").empty();
            for (const item of data) {
                let tr=$("<tr>").appendTo(table.children("tbody"));
                let td=$("<td>").appendTo(tr).text(item._id).prop("id",item._id).on("click",visualizzaDettagli);
                td=$("<td>").appendTo(tr).text(item.name).prop("id",item._id).on("click",visualizzaDettagli);
                td=$("<td>").appendTo(tr);
                for (let i = 0; i < 3; i++) {
                    $("<div>").appendTo(td);
                }
            }
        })
    });
    function visualizzaDettagli()
    {
        let request = inviaRichiesta("GET","/api/"+currentCollection+"/"+$(this).prop("id"));
        request.fail(errore);
        request.done(function(data){
            console.log(data);
            let content="";
            for (const key in data[0]) {
                content+="<strong>"+key+"</strong> : "+data[0][key]+"<br>";
                divDettagli.html(content);
            }
        })
    }
});