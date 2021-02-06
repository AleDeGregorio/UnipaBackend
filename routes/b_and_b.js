var express = require('express');
var DB = require('../db');

var router = express.Router();

// insert new b&b in table b_and_b
// indirizzo: /insertBB/new
router.post('/new', async(req, res, next) => {
    try {
        let insert = await DB.B_and_b.insertBB(req.body);
        res.json(insert);
    }
    catch(e) {
        next(e);
    }
});

// update fields of table b_and_b
// indirizzo: /updateBB/fields
router.post('/fields', async(req, res, next) => {
    try {
        let update = await DB.B_and_b.updateBB(req.body);
        res.json(update);
    }
    catch(e) {
        next(e);
    }
});


// delete b&b from table b_and_b
// indirizzo: /deletetBB/deleted
router.post('/deleted', async(req, res, next) => {
    try {
        let deleted = await DB.B_and_b.deleteBB(req.body);
        res.json(deleted);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;