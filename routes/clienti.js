var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new user in table cliente (with encrypted password)
// indirizzo: /insertCliente/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.Cliente.insertUser(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

// login user of table cliente (using encrypted password)
// indirizzo: /loginCliente/clienteLogged
router.post('/clienteLogged', async(req, res, next) => {
    try {
        let login = await DB.Cliente.login(req.body);
        res.json(login);
    }
    catch(e) {
        next(e);
    }
});

// show searched cliente (by email_cl)
// indirizzo: /searchCliente/results
router.post('/results', async(req, res, next) => {
    try {
        let search = await DB.Cliente.getUser(req.body);
        res.json(search);
    }
    catch(e) {
        next(e);
    }
});

// update fields of table cliente
// indirizzo: /updateCliente/fields
router.post('/fields', async(req, res, next) => {
    try {
        let update = await DB.Cliente.updateUser(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

// update password of table cliente
// indirizzo: /updateClientePassword/updPassword
router.post('/updPassword', async(req, res, next) => {
    try {
        let update = await DB.Cliente.updateUserPassword(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;