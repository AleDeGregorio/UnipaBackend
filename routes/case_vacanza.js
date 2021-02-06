var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new casa vacanza in table casa_vacanza
// indirizzo: /insertCasa/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.Casa.insertCasa(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

// get non_disponibile_inizio_cv and non_disponibile_fine_cv from ref_proprieta
// indirizzo: /getDateCasa/dateCasa
router.post('/dateCasa', async(req, res, next) => {
    try {
        let getDate = await DB.Casa.getDateCasa(req.body);
        res.json(getDate);
    }
    catch(e) {
        next(e);
    }
});

// update fields of table casa_vacanza
// indirizzo: /updateCasa/fields
router.post('/fields', async(req, res, next) => {
    try {
        let update = await DB.Casa.updateCasa(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});

// caricamento foto
// indirizzo: /uploadFotoCV/upload
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

// delete casa vacanza from table casa_vacanza
// indirizzo: /deletetCasa/deleted
router.post('/deleted', async(req, res, next) => {
    try {
        let deleted = await DB.Casa.deleteCasa(req.body);
        res.json(deleted);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;