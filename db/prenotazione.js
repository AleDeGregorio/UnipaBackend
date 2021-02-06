// connection to mysql db
var db = require('./config');
var mysql = require('mysql');
var Connection = mysql.createConnection(db.mysql);

Connection.connect(function(err) {
    if(err) throw err;
});

//requiring custom errors 
var { GeneralError, BadRequest, NotFound } = require('../utils/errors');

// utility function for table "prenotazione"

// insert new prenotazione
const insertPrenotazione = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'INSERT INTO prenotazione (ref_soggiornante, ref_cliente, ref_proprietario, ref_proprieta, num_soggiornanti, ' +
                'costo, caparra, data_partenza, data_ritorno, accettata, checkin) VALUES ' +
            '("' + req.ref_soggiornante + '", "' + req.ref_cliente + '", "' + req.ref_proprietario + '", ' + req.ref_proprieta + 
            ', ' + req.num_soggiornanti + ', ' + req.costo + ', ' + req.caparra + ', (STR_TO_DATE("' + req.data_partenza + '","%d/%m/%Y")), ' + 
            '(STR_TO_DATE("' + req.data_ritorno + '","%d/%m/%Y")), null, false)',
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

// get prenotazione from ref_cliente
const getPrenotazioneCliente = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT * ' +
            'FROM prenotazione, proprieta, soggiornante ' +
            'WHERE ref_cliente = "' +  req.ref_cliente + '" AND ref_proprieta = id_proprieta AND ref_soggiornante = cf_sogg AND ' +
            'prenotazione.ref_proprietario IS NOT NULL; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessuna prenotazione relativa al cliente'));
                }

            var res1 = results;
            
            if(res1[0].tipo_proprieta === 'cv') {
                Connection.query(
                    'SELECT * ' + 
                    'FROM casa_vacanza ' +
                    'WHERE ref_proprieta_cv = ' + res1[0].id_proprieta + '; ',
                    (err, results) => {
                        if(err) {
                            console.log(err);
                            return reject(new GeneralError('Si è verificato un errore'));
                        }
                        if(results.length < 1) {
                            return reject(new NotFound('Casa vacanza non trovata'));
                        }

                        for(var i = 0; i < res1.length; i++) {
                            res1[i].img = results[0].imgCV_path1;
                            res1[i].non_disponibile_inizio = results[i] ? results[i].non_disponibile_inizio_cv.toLocaleDateString() : '';
                            res1[i].non_disponibile_fine = results[i] ? results[i].non_disponibile_fine_cv.toLocaleDateString() : '';
                        }

                        resolve(res1);
                    }
                )
            }
            else {
                Connection.query(
                    'SELECT * ' +
                    'FROM b_and_b, stanza ' +
                    'WHERE ref_proprieta_bb = ' + res1[0].id_proprieta + ' AND ref_proprieta_bb = ref_bb ',
                    (err, results) => {
                        if(err) {
                            console.log(err);
                            return reject(new GeneralError('Si è verificato un errore'));
                        }
                        if(results.length < 1) {
                            return reject(new NotFound('B&B non trovato'));
                        }

                        for(var i = 0; i < res1.length; i++) {
                            res1[i].img = results[0].imgST_path1;
                            res1[i].id_stanza = results[i] ? results[i].id_stanza : '';
                            res1[i].non_disponibile_inizio = results[i] ? results[i].non_disponibile_inizio_st.toLocaleDateString() : '';
                            res1[i].non_disponibile_fine = results[i] ? results[i].non_disponibile_fine_st.toLocaleDateString() : '';
                        }
                        resolve(res1);
                    }
                )
            }
        });
    });
}

// get prenotazioni da accettare from ref_proprietario
const getPrenotazioneAccettazione = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT * ' +
            'FROM prenotazione, proprieta ' +
            'WHERE prenotazione.ref_proprietario = "' + req.ref_proprietario + '" AND accettata IS NULL AND ref_proprieta = id_proprieta AND' +
            ' checkin = false;',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessuna prenotazione da accettare'));
                }

                var res1 = results;
            
                if(res1[0].tipo_proprieta === 'cv') {
                    Connection.query(
                        'SELECT * ' + 
                        'FROM casa_vacanza ' +
                        'WHERE ref_proprieta_cv = ' + res1[0].id_proprieta + '; ',
                        (err, results) => {
                            if(err) {
                                console.log(err);
                                return reject(new GeneralError('Si è verificato un errore'));
                            }
                            if(results.length < 1) {
                                return reject(new NotFound('Casa vacanza non trovata'));
                            }

                            for(var i = 0; i < res1.length; i++) {
                                res1[i].img = results[0].imgCV_path1;
                            }

                            resolve(res1);
                        }
                    )
                }
                else {
                    Connection.query(
                        'SELECT * ' +
                        'FROM b_and_b, stanza ' +
                        'WHERE ref_proprieta_bb = ' + res1[0].id_proprieta + ' AND ref_proprieta_bb = ref_bb ',
                        (err, results) => {
                            if(err) {
                                console.log(err);
                                return reject(new GeneralError('Si è verificato un errore'));
                            }
                            if(results.length < 1) {
                                return reject(new NotFound('B&B non trovato'));
                            }

                            for(var i = 0; i < res1.length; i++) {
                                res1[i].img = results[0].imgST_path1;
                                res1[i].id_stanza = results[i].id_stanza;
                            }
                            console.log(res1);
                            resolve(res1);
                        }
                    )
                }
            }
        );
    });
}

// get prenotazioni già accettate from ref_proprietario
const getPrenotazioneAccettata = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT * ' +
            'FROM prenotazione, proprieta, soggiornante ' +
            'WHERE prenotazione.ref_proprietario = "' + req.ref_proprietario + '" AND accettata = true AND ref_proprieta = id_proprieta AND ' +
            'checkin = false AND cf_sogg = ref_soggiornante; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                /*if(results.length < 1) {
                    return reject(new NotFound('Nessuna prenotazione accettata'));
                }*/

                if(results.length < 1) {
                    resolve(results);
                }
                
                else {
                    var res1 = results;
                
                    if(res1[0].tipo_proprieta === 'cv') {
                        Connection.query(
                            'SELECT * ' + 
                            'FROM casa_vacanza ' +
                            'WHERE ref_proprieta_cv = ' + res1[0].id_proprieta + '; ',
                            (err, results) => {
                                if(err) {
                                    console.log(err);
                                    return reject(new GeneralError('Si è verificato un errore'));
                                }
                                if(results.length < 1) {
                                    return reject(new NotFound('Casa vacanza non trovata'));
                                }

                                for(var i = 0; i < res1.length; i++) {
                                    res1[i].img = results[0].imgCV_path1;
                                }

                                resolve(res1);
                            }
                        )
                    }
                    else {
                        Connection.query(
                            'SELECT * ' +
                            'FROM b_and_b, stanza ' +
                            'WHERE ref_proprieta_bb = ' + res1[0].id_proprieta + ' AND ref_proprieta_bb = ref_bb ',
                            (err, results) => {
                                if(err) {
                                    console.log(err);
                                    return reject(new GeneralError('Si è verificato un errore'));
                                }
                                if(results.length < 1) {
                                    return reject(new NotFound('B&B non trovato'));
                                }

                                for(var i = 0; i < res1.length; i++) {
                                    res1[i].img = results[0].imgST_path1;
                                    res1[i].id_stanza = results[i].id_stanza;
                                }

                                resolve(res1);
                            }
                        )
                    }
                }
            }
        );
    });
}

// controllo vincolo 28 giorni
const checkSoggiornante = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT @sogg := "' + req.ref_soggiornante + '"; ' +
            'SELECT @anno := ' + req.anno + '; ' +
            'SELECT @prenotazione := ' + req.id_prenotazione + '; ' +
            'SELECT @proprieta := ' + req.proprieta + '; ' +
            'SELECT pre.ref_soggiornante, SUM(datediff(pre.data_ritorno, pre.data_partenza)) AS tot_giorni ' +
            'FROM prenotazione pre, proprieta pro ' + 
            'WHERE pre.ref_proprieta = pro.id_proprieta AND pro.id_proprieta = @proprieta AND ' +
            'pro.tipo_proprieta = "cv" AND pre.ref_soggiornante = @sogg AND ' +
            'YEAR(pre.data_ritorno) = @anno AND pre.id_prenotazione != @prenotazione AND pre.accettata IS NOT NULL; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessuna corrispondenza trovata'));
                }
                else {
                    resolve(results);
                }
            }
        )
    })
}

// accetta prenotazione in pendenza
const accettaPrenotazione = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'UPDATE prenotazione ' +
            'SET accettata = true ' +
            'WHERE id_prenotazione = ' + req.id_prenotazione + '; ', 
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Prenotazione non trovata'));
                }

                if(req.tipo_proprieta === 'cv') {
                    Connection.query(
                        'UPDATE casa_vacanza ' +
                        'SET non_disponibile_inizio_cv = (STR_TO_DATE("' + req.data_partenza + '","%d/%m/%Y")), non_disponibile_fine_cv = (STR_TO_DATE("' + req.data_ritorno + '","%d/%m/%Y")) ' +
                        'WHERE ref_proprieta_cv = ' + req.ref_proprieta + '; ',
                        (err, results) => {
                            if(err) {
                                console.log(err);
                                return reject(new GeneralError('Si è verificato un errore'));
                            }
                            if(results.length < 1) {
                                return reject(new NotFound('Casa vacanza non trovata'));
                            }

                            resolve(results);
                        }
                    );
                }
                else {
                    Connection.query(
                        'UPDATE stanza ' + 
                        'SET non_disponibile_inizio_st = (STR_TO_DATE("' + req.data_partenza + '","%d/%m/%Y")), non_disponibile_fine_st= (STR_TO_DATE("' + req.data_ritorno + '","%d/%m/%Y")) ' +
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
                }
            }
        );
    });
}

// rifiuta prenotazione in pendenza
const rifiutaPrenotazione = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'UPDATE prenotazione ' +
            'SET accettata = false ' +
            'WHERE id_prenotazione = ' + req.id_prenotazione + '; ', 
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Prenotazione non trovata'));
                }

                resolve(results);
            }
        );
    });
}

// update date prenotazione
const updateDatePrenotazione = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'UPDATE prenotazione ' +
            'SET data_partenza = (STR_TO_DATE("' + req.data_partenza + '","%d/%m/%Y")), data_ritorno = (STR_TO_DATE("' + req.data_ritorno + '","%d/%m/%Y")), accettata = null ' +
            'WHERE id_prenotazione = ' + req.id_prenotazione + '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Prenotazione non trovata'));
                }
                resolve(results);
            }
        );
    })
}

// check in prenotazione
const checkinPrenotazione = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'UPDATE prenotazione ' +
            'SET checkin = true ' +
            'WHERE id_prenotazione = ' + req.id_prenotazione + '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Prenotazione non trovata'));
                }
                resolve(results);
            }
        )
    })
}

// delete prenotazione
const deletePrenotazione = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'UPDATE prenotazione ' +
            'SET ref_proprietario = null ' +
            'WHERE id_prenotazione = ' + req.id_prenotazione + '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Prenotazione non trovata'));
                }
                resolve(results);
            }
        )
    })
}

module.exports = {
    insertPrenotazione,
    getPrenotazioneCliente,
    getPrenotazioneAccettazione,
    getPrenotazioneAccettata,
    checkSoggiornante,
    accettaPrenotazione,
    rifiutaPrenotazione,
    updateDatePrenotazione,
    checkinPrenotazione,
    deletePrenotazione
}