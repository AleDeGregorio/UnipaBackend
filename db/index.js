var mysql = require('mysql');

var config = require('./config');

const Connection = mysql.createConnection(config.mysql);

var B_and_b = require('./b_and_b');
var Casa = require('./casa_vacanza');
var Cliente = require('./cliente');
var Prenotazione = require('./prenotazione');
var Proprieta = require('./proprieta');
var Proprietario = require('./proprietario');
var Servizio = require('./servizio');
var Soggiornante = require('./soggiornante');
var Stanza = require('./stanza');
var Tassa_soggiorno = require('./tassa_soggiorno');
var Utente = require('./utente');

Connection.connect(err => {
    if(err) console.log(err)
});

module.exports = {
    B_and_b,
    Casa,
    Cliente,
    Prenotazione,
    Proprieta,
    Proprietario,
    Servizio,
    Soggiornante,
    Stanza,
    Tassa_soggiorno,
    Utente
}