// connection to mysql db
var db = require('./config');
var mysql = require('mysql');
var Connection = mysql.createConnection(db.mysql);

Connection.connect(function(err) {
    if(err) throw err;
});

//requiring custom errors 
var { GeneralError, BadRequest, NotFound } = require('../utils/errors');

// utility function for table "b_and_b"

// insert new b&b
const insertBB = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'INSERT INTO b_and_b VALUES ' +
            '(' + req.ref_proprieta_bb + ', ' + req.check_in + ', ' + req.check_out + ')',
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

// update fields
const updateBB = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'UPDATE b_and_b ' +
            'SET check_in = ' + req.check_in + ', check_out = ' + req.check_out + ' ' +
            'WHERE ref_proprieta_bb = ' + req.ref_proprieta_bb + '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('B&B non trovato'));
                }
                resolve(results);
            }
        );
    })
}

// delete b&b
const deleteBB = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'DELETE FROM b_and_b WHERE ref_proprieta_bb = ' + req.ref_proprieta_bb + '; ' +
            'DELETE FROM stanza WHERE ref_bb = ' + req.ref_proprieta_bb + '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('B&B non trovato'));
                }
                resolve(results);
            }
        )
    })
}

module.exports = {
    insertBB,
    updateBB,
    deleteBB
}