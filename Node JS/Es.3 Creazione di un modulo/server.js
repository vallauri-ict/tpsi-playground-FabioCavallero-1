let modulo=require("modulo.js"); //Runnare da qui
modulo(); //Richiama la funzione anonima 
let ris1=modulo.somma(3,7);
let ris2=modulo.moltiplicazione(3,4);
console.log(`Risultato somma: ${ris1} \nRisultato moltiplicazione: ${ris2}`);
console.log(ris1,ris2);
console.log(modulo.json.nome);
modulo.json.setNome("ZetaKappa");
console.log(modulo.json.nome);