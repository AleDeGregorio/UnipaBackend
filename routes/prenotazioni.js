var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new prenotazione in table prenotazione
// indirizzo: /insertPrenotazione/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.Prenotazione.insertPrenotazione(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

// show searched prenotazione (by ref_cliente)
// indirizzo: /searchPrenotazioneCliente/prenotazioneCliente
router.post('/prenotazioneCliente', async(req, res, next) => {
    try {
        let search = await DB.Prenotazione.getPrenotazioneCliente(req.body);
        res.json(search);
    }
    catch(e) {
        next(e);
    }
});

// show searched prenotazione with accettata = null (by ref_proprietario)
// indirizzo: /getPrenotazioniAccettazione/prenotazioniAccettazione
router.post('/prenotazioniAccettazione', async(req, res, next) => {
    try {
        let prenAcc = await DB.Prenotazione.getPrenotazioneAccettazione(req.body);
        res.json(prenAcc);
    }
    catch(e) {
        next(e);
    }
});

// show searched prenotazione with accettata = true (by ref_proprietario)
// indirizzo: /getPrenotazioniAccettate/prenotazioniAccettate
router.post('/prenotazioniAccettate', async(req, res, next) => {
    try {
        let prenAcc = await DB.Prenotazione.getPrenotazioneAccettata(req.body);
        res.json(prenAcc);
    }
    catch(e) {
        next(e);
    }
});

// controlla vincolo dei 28 giorni per prenotazione casa vacanza
// indirizzo: /checkSoggiornante/resultIdoneita
router.post('/resultIdoneita', async(req, res, next) => {
    try {
        let check = await DB.Prenotazione.checkSoggiornante(req.body);
        res.json(check);
    }
    catch(e) {
        next(e);
    }
});

// accetta prenotazione in pendenza (da id_prenotazione)
// indirizzo: /accettaPrenotazione/accettata
router.post('/accettata', async(req, res, next) => {
    try {
        let accetta = await DB.Prenotazione.accettaPrenotazione(req.body);
        res.json(accetta);
    }
    catch(e) {
        next(e);
    }
});

// rifiuta prenotazione in pendenza (da id_prenotazione)
// indirizzo: /rifiutaPrenotazione/rifiutata
router.post('/rifiutata', async(req, res, next) => {
    try {
        let rifiuta = await DB.Prenotazione.rifiutaPrenotazione(req.body);
        res.json(rifiuta);
    }
    catch(e) {
        next(e);
    }
});

// update date of table Prenotazione (from id_prenotazione)
// indirizzo: /updateDatePrenotazione/newDate
router.post('/newDate', async(req, res, next) => {
    try {
        let update = await DB.Prenotazione.updateDatePrenotazione(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

// effettuato check in prenotazione from id_prenotazione
// indirizzo: /checkinPrenotazione/checkin
router.post('/checkin', async(req, res, next) => {
    try {
        let checkin = await DB.Prenotazione.checkinPrenotazione(req.body);
        res.json(checkin)
    }
    catch(e) {
        next(e);
    }
});

// delete prenotazione from id_prenotazione
// indirizzo: /deletePrenotazione/delete
router.post('/delete', async(req, res, next) => {
    try {
        let deleted = await DB.Prenotazione.deletePrenotazione(req.body);
        res.json(deleted)
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;