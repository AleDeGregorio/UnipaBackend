var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(fileUpload());

// NECESSARIO PER L'APP MOBILE. BISOGNA UTILIZZARE IL PROPRIO INDIRIZZO IP. Viene riportato il mio come esempio
/*app.get("/", (req, res) => {
  res.redirect('http://192.168.1.106:3000');
});*/

// import di tutti i router necessari
var proprietarioRouter = require('./routes/proprietari');
var proprietaRouter = require('./routes/proprieta');
var casaRouter = require('./routes/case_vacanza');
var bbRouter = require('./routes/b_and_b');
var stanzaRouter = require('./routes/stanze');
var clienteRouter = require('./routes/clienti');
var servizioRouter = require('./routes/servizi');
var soggiornanteRouter = require('./routes/soggiornanti');
var prenotazioneRouter = require('./routes/prenotazioni');
var tassaRouter = require('./routes/tasse_soggiorno');
var utenteRouter = require('./routes/utenti');

var handleErrors = require('./routes/handleErrors');

// list of all routes used

// TABELLA UTENTE (CLIENTE + PROPRIETARIO)
// login user of table cliente or proprietario (using encrypted password)
// indirizzo: /login/logged
app.use('/login', utenteRouter);

// TABELLA PROPRIETARIO
// registrazione di un nuovo proprietario
// indirizzo: /insertProprietario/new
app.use('/insertProprietario', proprietarioRouter);
// registrazione di un nuovo proprietario che era cliente
// indirizzo: /insertProprietarioCliente/newPropCl
app.use('/insertProprietarioCliente', proprietarioRouter);
// login di un proprietario utilizzando password criptata
// indirizzo: /loginProprietario/proprietarioLogged
app.use('/loginProprietario', proprietarioRouter);
// ricerca di un proprietario dall'email
// indirizzo: /searchProprietarioEmail/proprietarioEmail
app.use('/searchProprietarioEmail', proprietarioRouter);
// get ultima data di invio dati ufficio turismo of table Proprietario
// indirizzo: /getDataInvio/dataInvio
app.use('/getDataInvio', proprietarioRouter);
// mostra guadagni proprietario, fornendo email e anno per la ricerca
// indirizzo: /getGuadagni/guadagniProprietario
app.use('/getGuadagni', proprietarioRouter);
// mostra guadagni proprietario, fornendo email, range e tipo proprieta per la ricerca
// indirizzo: /getGuadagniTipo/guadagniProprietarioTipo
app.use('/getGuadagniTipo', proprietarioRouter);
// mostra guadagni proprietario, fornendo email, range e id proprieta per la ricerca
// indirizzo: /getGuadagniProprieta/guadagniProprietarioProprieta
app.use('/getGuadagniProprieta', proprietarioRouter);
// modifica dei campi di un proprietario (fornendo l'email)
// indirizzo: /updateProprietario/fields
app.use('/updateProprietario', proprietarioRouter);
// modifica della password di un proprietario (fornendo l'email)
// indirizzo: /updateProprietarioPassword/updPass
app.use('/updateProprietarioPassword', proprietarioRouter);
// update ultima data di invio dati ufficio turismo of table Proprietario
// indirizzo: /updateDataInvio/invioDati
app.use('/updateDataInvio', proprietarioRouter);

// TABELLA PROPRIETA
// inserimento di una nuova proprieta
// indirizzo: /insertProprieta/new
app.use('/insertProprieta', proprietaRouter);
// ----------METODO PRINCIPALE DA USARE PER LA RICERCA----------
// indirizzo: /ricercaAlloggio/risultati
app.use('/ricercaAlloggio', proprietaRouter);
// ricerca di una proprieta dal suo Proprietario
// indirizzo: /searchProprietaProprietario/proprietaProprietario
app.use('/searchProprietaProprietario', proprietaRouter);
// show searched proprieta (by Tipo = cv && ref_proprietario)
// indirizzo: /searchProprietaCVProprietario/proprietaCVProprietario
app.use('/searchProprietaCVProprietario', proprietaRouter);
// show searched proprieta (by Tipo = bb && ref_proprietario)
// indirizzo: /searchProprietaBBProprietario/proprietaBBProprietario
app.use('/searchProprietaBBProprietario', proprietaRouter);
// modifica dei campi di una proprieta (fornendo l'id)
// indirizzo: /updateProprieta/fields
app.use('/updateProprieta', proprietaRouter);

// TABELLA CASA VACANZA
// inserimento di una nuova casa
// indirizzo: /insertCasa/new
app.use('/insertCasa', casaRouter);
// ricerca di date non disponibile inizio e fine della casa dal suo id
// indirizzo: /getDateCasa/dateCasa
app.use('/getDateCasa', casaRouter);
// modifica dei campi di una casa vacanza (fornendo il suo id)
// indirizzo: /updateCasa/fields
app.use('/updateCasa', casaRouter);
// caricamento foto
// indirizzo: /uploadFotoCV/upload
app.use('/uploadFotoCV', casaRouter);
// cancellazione di una casa
// indirizzo: /deleteCasa/deleted
app.use('/deleteCasa', casaRouter);

// TABELLA B&B
// inserimento di un nuovo b&b
// indirizzo: /insertBB/new
app.use('/insertBB', bbRouter);
// modifica dei campi di un b&b (fornendo il suo id)
// indirizzo: /updateBB/fields
app.use('/updateBB', bbRouter);
// cancellazione di un b&b
// indirizzo: /deleteBB/deleted
app.use('/deleteBB', bbRouter);

// TABELLA STANZA
// inserimento di una nuova stanza
// indirizzo: /insertStanza/new
app.use('/insertStanza', stanzaRouter);
// ricerca di una stanza dal suo ref_bb
// indirizzo: /searchStanzaBB/stanzaBB
app.use('/searchStanzaBB', stanzaRouter);
// ricerca di date non disponibile inizio e fine della stanza dal suo id
// indirizzo: /getDateStanza/dateStanza
app.use('/getDateStanza', stanzaRouter);
// modifica dei campi di una Stanza (fornendo il suo id)
// indirizzo: /updateStanza/fields
app.use('/updateStanza', stanzaRouter);
// caricamento foto
// indirizzo: /uploadFotoST/upload
app.use('/uploadFotoST', stanzaRouter);
// cancellazione di una stanza
// indirizzo: /deleteStanza/deleted
app.use('/deleteStanza', stanzaRouter);

// TABELLA CLIENTE
// inserimento di un nuovo cliente
// indirizzo: /insertCliente/new
app.use('/insertCliente', clienteRouter);
// login di un cliente utilizzando password criptata
// indirizzo: /loginCliente/clienteLogged
app.use('/loginCliente', clienteRouter);
// ricerca di un cliente dalla sua email
// indirizzo: /searchCliente/results
app.use('/searchCliente', clienteRouter);
// modifica dei campi di un cliente (fornendo la sua email)
// indirizzo: /updateCliente/fields
app.use('/updateCliente', clienteRouter);
// modifica della password di un cliente (fornendo la sua email)
// indirizzo: /updateClientePassword/updPassword
app.use('/updateClientePassword', clienteRouter);

// TABELLA SERVIZI
// lista di tutti i servizi
// indirizzo: /servizi/all
app.use('/servizi', servizioRouter);
// inserimento di un nuovo servizio
// indirizzo: /insertServizio/new
app.use('/insertServizio', servizioRouter);

// TABELLA SOGGIORNANTE
// inserimento di un nuovo soggiornante
// indirizzo: /insertSoggiornante/new
app.use('/insertSoggiornante', soggiornanteRouter);

// TABELLA PRENOTAZIONE
// inserimento di una nuova prenotazione
// indirizzo: /insertPrenotazione/new
app.use('/insertPrenotazione', prenotazioneRouter);
// ricerca di una prenotazione dal suo ref_cliente
// indirizzo: /searchPrenotazioneCliente/prenotazioneCliente
app.use('/searchPrenotazioneCliente', prenotazioneRouter);
// mostra prenotazioni da accettare (da ref_proprietario)
// indirizzo: /getPrenotazioniAccettazione/prenotazioniAccettazione
app.use('/getPrenotazioniAccettazione', prenotazioneRouter);
// mostra prenotazioni già accettate (da ref_proprietario)
// indirizzo: /getPrenotazioniAccettate/prenotazioniAccettate
app.use('/getPrenotazioniAccettate', prenotazioneRouter);
// controlla vincolo dei 28 giorni per prenotazione casa vacanza
// indirizzo: /checkSoggiornante/resultIdoneita
app.use('/checkSoggiornante', prenotazioneRouter);
// accetta prenotazione in pendenza (da id_prenotazione)
// indirizzo: /accettaPrenotazione/accettata
app.use('/accettaPrenotazione', prenotazioneRouter);
// rifiuta prenotazione in pendenza (da id_prenotazione)
// indirizzo: /rifiutaPrenotazione/rifiutata
app.use('/rifiutaPrenotazione', prenotazioneRouter);
// update date of table Prenotazione (from id_prenotazione)
// indirizzo: /updateDatePrenotazione/newDate
app.use('/updateDatePrenotazione', prenotazioneRouter);
// effettuato check in prenotazione from id_prenotazione
// indirizzo: /checkinPrenotazione/checkin
app.use('/checkinPrenotazione', prenotazioneRouter);
// delete prenotazione from id_prenotazione
// indirizzo: /deletePrenotazione/delete
app.use('/deletePrenotazione', prenotazioneRouter);

// TABELLA TASSA SOGGIORNO
// inserimento di una nuova tassa
// indirizzo: /insertTassa/new
app.use('/insertTassa', tassaRouter);
// ricerca tasse di soggiorno del proprietario, con join con tabella prenotazione. Da usare per invio dati ufficio turismo
// indirizzo: /getTasseInvio/tasse
app.use('/getTasseInvio', tassaRouter);
// elimina tasse di soggiorno del proprietario. Da usare dopo invio dati ufficio turismo
// indirizzo: /deleteTasseInvio/deleteTasse
app.use('/deleteTasseInvio', tassaRouter);

app.use(handleErrors);

module.exports = app;
