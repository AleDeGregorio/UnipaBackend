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

// return all table
const all = async () => {
    return new Promise((resolve, reject) => {

        Connection.query('SELECT * FROM servizi', (err, results) => {
            if(err) {
                console.log(err);
                return reject(new GeneralError('Si è verificato un errore'));
            }
            if(results.length < 1) {
                return reject(new NotFound('Nessun servizio registrato'));
            }
            resolve(results);
        });
    });
}

// insert new servizio
const insertServizio = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'INSERT INTO servizi (servizio) VALUES ' +
            '("' + req.servizio + '")',
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

module.exports = {
    all,
    insertServizio
}