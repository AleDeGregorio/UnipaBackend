// connection to mysql db
var db = require('./config');
var mysql = require('mysql');
var Connection = mysql.createConnection(db.mysql);

Connection.connect(function(err) {
    if(err) throw err;
});

//requiring custom errors 
var { GeneralError, BadRequest, NotFound } = require('../utils/errors');

// utility function for table "tassa_soggiorno"

// insert new tassa
const insertTassa = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'INSERT INTO tassa_soggiorno (ref_soggiornante, ref_proprietario, data_partenza, data_ritorno, ammontare) VALUES ' +
            '("' + req.ref_soggiornante + '", "' + 
            req.ref_proprietario + '", (STR_TO_DATE("' + req.data_partenza + '","%d/%m/%Y")), ' + 
            '(STR_TO_DATE("' + req.data_ritorno + '","%d/%m/%Y")), ' + req.ammontare + ')',
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

// get tasse from ref_proprietario
// DA USARE PER INVIO DATI ALL'UFFICIO DEL TURISMO 
const getTasseInvio = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT * ' +
            'FROM tassa_soggiorno ' +
            'WHERE ref_proprietario = "' + req.ref_proprietario + '"; ', 
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessuna tassa di soggiorno relativa al proprietario'));
                }
            resolve(results);
        });
    });
}

// delete tasse from ref_proprietario
// DA USARE DOPO INVIO DATI ALL'UFFICIO DEL TURISMO 
const deleteTasseInvio = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'DELETE ' +
            'FROM tassa_soggiorno ' +
            'WHERE ref_proprietario = "' + req.ref_proprietario + '"; ', 
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessuna tassa di soggiorno relativa al proprietario'));
                }
            resolve(results);
        });
    });
}

module.exports = {
    insertTassa,
    getTasseInvio,
    deleteTasseInvio
}