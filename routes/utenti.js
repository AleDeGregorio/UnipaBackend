var express = require('express');
var DB = require('../db');

var router = express.Router();

// login user of table cliente or proprietario (using encrypted password)
// indirizzo: /login/logged
router.post('/logged', async(req, res, next) => {
    try {
        let login = await DB.Utente.login(req.body);
        res.json(login);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;