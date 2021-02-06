var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new stanza in table stanza
// indirizzo: /insertStanza/new
router.post('/new', async(req, res) => {
    try {
        let insert = await DB.Stanza.insertStanza(req.body);
        res.json(insert);
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// show searched stanza (by ref_bb)
// indirizzo: /searchStanzaBB/stanzaBB
router.post('/stanzaBB', async(req, res) => {
    try {
        let search = await DB.Stanza.getStanzaBB(req.body);
        res.json(search);
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// get non_disponibile_inizio_st and non_disponibile_fine_st from id_stanza
// indirizzo: /getDateStanza/dateStanza
router.post('/dateStanza', async(req, res, next) => {
    try {
        let getDate = await DB.Stanza.getDateStanza(req.body);
        res.json(getDate);
    }
    catch(e) {
        next(e);
    }
});

// update fields of table Stanza
// indirizzo: /updateStanza/fields
router.post('/fields', async(req, res) => {
    try {
        let update = await DB.Stanza.updateStanza(req.body);
        res.json(update);
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// caricamento foto
// indirizzo: /uploadFotoST/upload
router.post('/upload', async(req, res, next) => {
    try {
        let foto1 = req.files.foto1 ? req.files.foto1 : null;
        let foto2 = req.files.foto2 ? req.files.foto2 : null;
        let foto3 = req.files.foto3 ? req.files.foto3 : null;
        let foto4 = req.files.foto4 ? req.files.foto4 : null;
        let filename1 = foto1 ? foto1.name : null;
        let filename2 = foto2 ? foto2.name : null;
        let filename3 = foto3 ? foto3.name : null;
        let filename4 = foto4 ? foto4.name : null;
        if(foto1) {
            foto1.mv('../Frontend/public/Images/' + filename1);
        }
        if(foto2) {
            foto2.mv('../Frontend/public/Images/' + filename2);
        }
        if(foto3) {
            foto3.mv('../Frontend/public/Images/' + filename3);
        }
        if(foto4) {
            foto4.mv('../Frontend/public/Images/' + filename4);
        }
        res.send("file uploaded");
    }
    catch(e) {
        next(e);
    }
});

// delete stanza from table stanza
// indirizzo: /deletetStanza/deleted
router.post('/deleted', async(req, res, next) => {
    try {
        let deleted = await DB.Stanza.deleteStanza(req.body);
        res.json(deleted);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;