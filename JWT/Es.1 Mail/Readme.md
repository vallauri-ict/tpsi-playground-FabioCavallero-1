# tpsi-playground-FabioCavallero-1

_Stud. Fabio Cavallero_

### Es.1 Mail

Realizzazione di un client di posta basato sulla seguente tabella: mail:{_id, username, password, mail}.
- Il campo mail è un vettore enumerativo contenente l’elenco di tutte le mail ricevute da quell’utente.
- Ciascuna mail è rappresentata da un json strutturato nel modo seguente {from, subject, body}.
- Il sistema è basato su un token JWT rilasciato dal server per ogni utente e contenente nel payload le seguenti
informazioni: {_id, username, iat, exp}. Il campo exp indica il periodo di validità del token (30 secondi).
