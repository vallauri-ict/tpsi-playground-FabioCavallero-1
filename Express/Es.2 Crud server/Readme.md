# tpsi-playground-FabioCavallero-1

_Stud. Fabio Cavallero_

### Es.2 Crud Server

Server che, indipendentemente dalla collezione richiesta dal client, esegue una
azione diversa a seconda del tipo di chiamata sulla base del seguente schema in cui, in tutte le chiamate,
id viene passato al server sempre come parte della risorsa:
- GET / restituisce l’elenco completo dei record (oppure solo pochi campi importanti presenti in
tutte le collezioni, tipicamente _id e name).
- GET /id restituisce il record avente l’id indicato.
- POST inserisce nella collezione il record ricevuto come parametro.
- DELETE /id elimina il record avente l’id indicato.
- PATCH /id aggiorna il record avente l’id indicato sulla base del json ricevuto come parametro.
- PUT /id sostituisce il record avente l’id indicato con il json ricevuto come parametro.
