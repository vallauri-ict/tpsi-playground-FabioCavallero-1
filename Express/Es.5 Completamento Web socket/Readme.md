# tpsi-playground-FabioCavallero-1

_Stud. Fabio Cavallero_

### Es.5 Completamento Web socket

Modificare l’esercizio precedente (replicandolo) in modo che:
- il server, in corrispondenza del message_notify, inoltri ai client anche un campo img contenente il
nome del file dell’immagine dell’utente che ha scritto il messaggio, andando a leggerlo nella
tabella images del DBMS. Se non lo trova, il campo img verrà inviato comunque e conterrà stringa
vuota.
- Il client, in fase di visualizzazione del messaggio, a fianco del nome dell’utente mittente,
visualizzerà anche l’immagine di quell’utente.

