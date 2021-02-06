var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new user in table proprietario
// indirizzo: /insertProprietario/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.Proprietario.insertUser(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

// insert new user in table proprietario from cliente
// indirizzo: /insertProprietarioCliente/newPropCl
router.post('/newPropCl', async(req, res, next) => {
    try {
        let insert = await DB.Proprietario.insertProprietarioCliente(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

// login user of table proprietario (using encrypted password)
// indirizzo: /loginProprietario/proprietarioLogged
router.post('/proprietarioLogged', async(req, res, next) => {
    try {
        let login = await DB.Proprietario.login(req.body);
        res.json(login);
    }
    catch(e) {
        next(e);
    }
});

// show searched proprietario (by email_prop)
// indirizzo: /searchProprietarioEmail/proprietarioEmail
router.post('/proprietarioEmail', async(req, res, next) => {
    try {
        let search = await DB.Proprietario.getUser(req.body);
        res.json(search);
    }
    catch(e) {
        next(e);
    }
});

// get ultima data di invio dati ufficio turismo of table Proprietario
// indirizzo: /getDataInvio/dataInvio
router.post('/dataInvio', async(req, res, next) => {
    try {
        let update = await DB.Proprietario.getDataInvio(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

// mostra guadagni proprietario, fornendo email e range per la ricerca
// indirizzo: /getGuadagni/guadagniProprietario
router.post('/guadagniProprietario', async(req, res, next) => {
    try {
        let guadagni = await DB.Proprietario.getGuadagni(req.body);
        res.json(guadagni);
    }
    catch(e) {
        next(e);
    }
});

// mostra guadagni proprietario, fornendo email, range e tipo proprieta per la ricerca
// indirizzo: /getGuadagniTipo/guadagniProprietarioTipo
router.post('/guadagniProprietarioTipo', async(req, res, next) => {
    try {
        let guadagni = await DB.Proprietario.getGuadagniTipo(req.body);
        res.json(guadagni);
    }
    catch(e) {
        next(e);
    }
});

// mostra guadagni proprietario, fornendo email, range e id proprieta per la ricerca
// indirizzo: /getGuadagniProprieta/guadagniProprietarioProprieta
router.post('/guadagniProprietarioProprieta', async(req, res, next) => {
    try {
        let guadagni = await DB.Proprietario.getGuadagniProprieta(req.body);
        res.json(guadagni);
    }
    catch(e) {
        next(e);
    }
});

// update fields of table Proprietario
// indirizzo: /updateProprietario/fields
router.post('/fields', async(req, res, next) => {
    try {
        let update = await DB.Proprietario.updateUser(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

// update password of table Proprietario
// indirizzo: /updateProprietarioPassword/updPass
router.post('/updPass', async(req, res, next) => {
    try {
        let update = await DB.Proprietario.updateUserPassword(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

// update ultima data di invio dati ufficio turismo of table Proprietario
// indirizzo: /updateDataInvio/invioDati
router.post('/invioDati', async(req, res, next) => {
    try {
        let update = await DB.Proprietario.invioDati(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;