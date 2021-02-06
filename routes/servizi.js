var express = require('express');
var DB = require('../db');

var router = express.Router();

// show all table b_and_b
// indirizzo: /servizi/all
router.get('/all', async (req, res, next) => {
    try {
        let servizi = await DB.Servizio.all();
        res.json(servizi);
    } catch(e) {
        next(e);
    }
});

// insert new servizio in table servizi
// indirizzo: /insertServizio/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.Servizio.insertServizio(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;