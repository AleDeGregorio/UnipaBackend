var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new tassa in table tassa_soggiorno
// indirizzo: /insertTassa/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.Tassa_soggiorno.insertTassa(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

// get tasse in table tassa_soggiorno && prenotazione from ref_proprietario
// indirizzo: /getTasseInvio/tasse
router.post('/tasse', async(req, res, next) => {
    try {
        let get = await DB.Tassa_soggiorno.getTasseInvio(req.body);
        res.json(get);
    }
    catch(e) {
        next(e);
    }
});

// delete tasse in table tassa_soggiorno from ref_proprietario
// indirizzo: /deleteTasseInvio/deleteTasse
router.post('/deleteTasse', async(req, res, next) => {
    try {
        let del = await DB.Tassa_soggiorno.deleteTasseInvio(req.body);
        res.json(del);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;