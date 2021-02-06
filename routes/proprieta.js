var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new proprieta in table proprieta
// indirizzo: /insertProprieta/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.Proprieta.insertProprieta(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

// elaborazione del form di ricerca di un alloggio, nel caso più generale
// ----------METODO PRINCIPALE DA USARE PER LA RICERCA----------
// indirizzo: /ricercaAlloggio/risultati
router.post('/risultati', async(req, res, next) => {
    try {
        let search = await DB.Proprieta.ricercaAlloggio(req.body);
        res.json(search);
    }
    catch(e) {
        next(e);
    }
});

// show searched proprieta (by Proprietario)
// indirizzo: /searchProprietaProprietario/proprietaProprietario
router.post('/proprietaProprietario', async(req, res, next) => {
    try {
        let search = await DB.Proprieta.getProprietaProprietario(req.body);
        res.json(search);
    }
    catch(e) {
        next(e);
    }
});

// show searched proprieta (by Tipo = cv && ref_proprietario)
// indirizzo: /searchProprietaCVProprietario/proprietaCVProprietario
router.post('/proprietaCVProprietario', async(req, res, next) => {
    try {
        let search = await DB.Proprieta.getProprietaCVProprietario(req.body);
        res.json(search);
    }
    catch(e) {
        next(e);
    }
});

// show searched proprieta (by Tipo = bb && ref_proprietario)
// indirizzo: /searchProprietaBBProprietario/proprietaBBProprietario
router.post('/proprietaBBProprietario', async(req, res, next) => {
    try {
        let search = await DB.Proprieta.getProprietaBBProprietario(req.body);
        res.json(search);
    }
    catch(e) {
        next(e);
    }
});

// update fields of table Proprieta
// indirizzo: /updateProprieta/fields
router.post('/fields', async(req, res, next) => {
    try {
        let update = await DB.Proprieta.updateProprieta(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;