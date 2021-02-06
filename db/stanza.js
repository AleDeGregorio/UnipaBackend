// connection to mysql db
var db = require('./config');
var mysql = require('mysql');
var Connection = mysql.createConnection(db.mysql);

Connection.connect(function(err) {
    if(err) throw err;
});

//requiring custom errors 
var { GeneralError, BadRequest, NotFound } = require('../utils/errors');

// utility function for table "stanza"

// insert new stanza
const insertStanza = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'INSERT INTO stanza (ref_bb, tipologia, tariffa_stanza, non_disponibile_inizio_st, non_disponibile_fine_st) VALUES ' +
            '(' + req.ref_bb + ', ' + req.tipologia + ', ' + req.tariffa_stanza + ', "1970-01-01", "1970-01-01"); ' +
            'SELECT @id := (SELECT id_stanza ' +
                            'FROM stanza ' +
                            'HAVING id_stanza >= ALL (SELECT id_stanza ' +
                                                    'FROM stanza)); ' +
            'SELECT @ref_bb := (SELECT ref_bb ' +
                                'FROM stanza ' +
                                'GROUP BY id_stanza ' +
                                'HAVING id_stanza >= ALL (SELECT id_stanza ' +
                                                        'FROM stanza)); ' +
            'UPDATE stanza ' +
            'SET imgST_path1 = CONCAT("./Images/", CAST(@id AS CHAR), "_", CAST(@ref_bb AS CHAR), "_1.jpg"), ' +
                'imgST_path2 = CONCAT("./Images/", CAST(@id AS CHAR), "_", CAST(@ref_bb AS CHAR), "_2.jpg"), ' +
                'imgST_path3 = CONCAT("./Images/", CAST(@id AS CHAR), "_", CAST(@ref_bb AS CHAR), "_3.jpg"), ' +
                'imgST_path4 = CONCAT("./Images/", CAST(@id AS CHAR), "_", CAST(@ref_bb AS CHAR), "_4.jpg") ' +
            'WHERE id_stanza = @id; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new BadRequest("Si è verificato un errore nell'inserimento"));
                }
                resolve(results);
        });
    });
}

// get stanza from ref_bb
const getStanzaBB = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT * ' +
            'FROM stanza ' +
            'WHERE ref_bb = ' +  req.ref_bb + '; ', (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessuna stanza relativa al b&b'));
                }
            resolve(results);
        });
    });
}

// get non_disponibile_inizio_st and non_disponibile_fine_st from id_stanza
const getDateStanza = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT non_disponibile_inizio_st, non_disponibile_fine_st ' + 
            'FROM stanza ' +
            'WHERE id_stanza = ' + req.id_stanza + '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Stanza non trovata'));
                }
                resolve(results);
            }
        )
    })
}

// update fields
const updateStanza= async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'UPDATE stanza ' +
            'SET tipologia = ' + req.tipologia + ', tariffa_stanza = ' + req.tariffa_stanza +
            ', imgST_path1 = "./Images/' + req.id_stanza + '_' + req.ref_bb + '_1.jpg"' +
            ', imgST_path2 = "./Images/' + req.id_stanza + '_' + req.ref_bb + '_2.jpg"' +
            ', imgST_path3 = "./Images/' + req.id_stanza + '_' + req.ref_bb + '_3.jpg"' +
            ', imgST_path4 = "./Images/' + req.id_stanza + '_' + req.ref_bb + '_4.jpg" ' +
            'WHERE id_stanza = ' + req.id_stanza + '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Stanza non trovata'));
                }
                resolve(results);
            }
        );
    });
}

// delete stanza
const deleteStanza = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'DELETE FROM stanza WHERE id_stanza = ' + req.id_stanza + '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Stanza non trovata'));
                }
                resolve(results);
            }
        )
    })
}

module.exports = {
    insertStanza,
    getStanzaBB,
    getDateStanza,
    updateStanza,
    deleteStanza
}