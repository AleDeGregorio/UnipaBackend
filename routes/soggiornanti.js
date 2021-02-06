var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new user in table soggiornante
// indirizzo: /insertSoggiornante/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.Soggiornante.insertSoggiornante(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;