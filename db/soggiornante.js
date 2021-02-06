// connection to mysql db
var db = require('./config');
var mysql = require('mysql');
var Connection = mysql.createConnection(db.mysql);

Connection.connect(function(err) {
    if(err) throw err;
});

//requiring custom errors 
var { GeneralError, BadRequest, NotFound } = require('../utils/errors');

// utility function for table "soggiornante"

// insert new soggiornante
const insertSoggiornante = async(req) => {
    
    return new Promise((resolve, reject) => {

        Connection.query(
            'INSERT INTO soggiornante VALUES ' +
            '("' + req.cf + '", "' + req.nome + '", "' + req.cognome + '", (STR_TO_DATE("' + req.nascita + '","%d/%m/%Y")))',
            (err, results) => {
                if(err && err.code !== 'ER_DUP_ENTRY') {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                resolve(results);
        });
    });
}

module.exports = {
    insertSoggiornante
}