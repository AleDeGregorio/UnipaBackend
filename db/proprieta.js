// connection to mysql db
var db = require('./config');
var mysql = require('mysql');
var Connection = mysql.createConnection(db.mysql);

Connection.connect(function(err) {
    if(err) throw err;
});

//requiring custom errors 
var { GeneralError, BadRequest, NotFound } = require('../utils/errors');

// utility function for table "proprieta"

// insert new proprieta
const insertProprieta = async(req) => {

    var servizi = '';
    for(var i = 0; i < req.servizi.length; i++) {
        if(i < req.servizi.length-1) {
            servizi = servizi + req.servizi[i] + ', ';
        }
        else {
            servizi = servizi + req.servizi[i];
        }
    }

    return new Promise((resolve, reject) => {

        Connection.query(
            'INSERT INTO proprieta (nome_proprieta, indirizzo, localita, provincia, tipo_proprieta, servizi, ref_proprietario, descrizione) VALUES ' +
            '("' + req.nome_proprieta + '", "' + req.indirizzo + '", "' + req.localita + '", "' + req.provincia +
            '", "' + req.tipo_proprieta + '", "' + servizi + '", "' +
            req.ref_proprietario + '", "' + req.descrizione + '"); ',
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

// elaborazione del form di ricerca di un alloggio, nel caso più generale
// ----------METODO PRINCIPALE DA USARE PER LA RICERCA----------
const ricercaAlloggio = async(req) => {
    var str1 = req.checkIn === '' ? '1970-01-01' : req.checkIn;

    var str2 = req.checkOut === '' ? '1970-01-01' : req.checkOut

    var partenza = new Date(str1);
    var ritorno = new Date(str2);

    const utc1 = Date.UTC(partenza.getFullYear(), partenza.getMonth(), partenza.getDate());
    const utc2 = Date.UTC(ritorno.getFullYear(), ritorno.getMonth(), ritorno.getDate());

    var ngiorni = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
    
    if(!ngiorni || ngiorni < 1 || ritorno.getFullYear() === 2099) {
        ngiorni = 1;
    }
    
    var servizi = '%';

    for(var i = 0; i < req.servizi.length; i++) {
        servizi = servizi + req.servizi[i] + '%';
    }

    return new Promise((resolve, reject) => {

        if(req.tipo === 'cv') {
            Connection.query(
                'SELECT @localita := "' + (req.localita === '' ? '%%' : req.localita) + '"; ' +
                'SELECT @provincia := "' + (req.provincia === '' ? '%%' : req.provincia) + '"; ' +
                'SELECT @posti := "' + req.posti + '"; ' +
                'SELECT @costo := ' + (req.costo === '' ? 99999 : req.costo) + '; ' +
                'SELECT @inizio := "'+ (req.checkIn === '' ? '1970-01-01' : req.checkIn) + '"; ' +
                'SELECT @fine := "'+ (req.checkOut === '' ? '1970-01-01' : req.checkOut) + '"; ' +
                'SELECT @servizi := "' + servizi + '"; ' +
                'SELECT DISTINCT p.nome_proprieta, p.indirizzo, p.localita, p.tipo_proprieta, p.servizi, p.provincia, ' +
                    'c.tariffa_casa* ' + ngiorni + ' AS costo, ' +
                    'c.tariffa_casa AS tariffa, ' +
                    'p.id_proprieta, p.ref_proprietario, ' +
                    ngiorni + ' AS ngiorni, ' +
                    'c.posti_letto AS posti, p.descrizione, ' +
                    'c.imgCV_path1 AS img1, ' +
                    'c.imgCV_path2 AS img2, ' +
                    'c.imgCV_path3 AS img3, ' +
                    'c.imgCV_path4 AS img4, ' +
                    'null AS check_in, ' +
                    'null AS check_out ' +
                'FROM proprieta p, casa_vacanza c ' +
                'WHERE p.id_proprieta = c.ref_proprieta_cv AND ' +
                    'LOWER(p.localita) LIKE LOWER(@localita) AND LOWER(p.provincia) LIKE LOWER(@provincia) AND ' +
                    'LOWER(p.servizi) LIKE LOWER(@servizi) AND ' +
                    'c.posti_letto LIKE @posti AND ' +
                    '(@fine <= c.non_disponibile_inizio_cv OR @inizio >= c.non_disponibile_fine_cv) ' +
                'HAVING c.tariffa_casa*' + ngiorni + ' <= @costo; ',
                (err, results) => {
                    if(err) {
                        console.log(err);
                        return reject(new GeneralError('Si è verificato un errore'));
                    }
                    if(results.length < 1) {
                        return reject(new NotFound('Nessun alloggio corrisponde alla ricerca'));
                    }
                    resolve(results[7]);
                }
            );
        }

        else if(req.tipo === 'bb') {
            Connection.query(
                'SELECT @localita := "' + (req.localita === '' ? '%%' : req.localita) + '"; ' +
                'SELECT @provincia := "' + (req.provincia === '' ? '%%' : req.provincia) + '"; ' +
                'SELECT @posti := "' + req.posti + '"; ' +
                'SELECT @costo := ' + (req.costo === '' ? 99999 : req.costo) + '; ' +
                'SELECT @inizio := "'+ (req.checkIn === '' ? '1970-01-01' : req.checkIn) + '"; ' +
                'SELECT @fine := "'+ (req.checkOut === '' ? '1970-01-01' : req.checkOut) + '"; ' +
                'SELECT @servizi := "' + servizi + '"; ' +
                'SELECT DISTINCT p.nome_proprieta, p.indirizzo, p.localita, p.tipo_proprieta, p.servizi, p.provincia, ' +
                    's.tariffa_stanza* ' + ngiorni + ' AS costo, ' +
                    's.tariffa_stanza AS tariffa, ' +
                    'p.id_proprieta, p.ref_proprietario, ' +
                    ngiorni + ' AS ngiorni, ' +
                    's.tipologia AS posti, p.descrizione, ' +
                    's.imgST_path1 AS img1, ' +
                    's.imgST_path2 AS img2, ' +
                    's.imgST_path3 AS img3, ' +
                    's.imgST_path4 AS img4, ' +
                    'b.check_in AS check_in, ' +
                    'b.check_out AS check_out ' +
                'FROM proprieta p, b_and_b b, stanza s ' +
                'WHERE p.id_proprieta = b.ref_proprieta_bb AND b.ref_proprieta_bb = s.ref_bb AND ' +
                    'LOWER(p.localita) LIKE LOWER(@localita) AND LOWER(p.provincia) LIKE LOWER(@provincia) AND ' +
                    'LOWER(p.servizi) LIKE LOWER(@servizi) AND ' +
                    's.tipologia LIKE @posti AND ' +
                    '(@fine <= s.non_disponibile_inizio_st OR @inizio >= s.non_disponibile_fine_st) ' +
                'HAVING s.tariffa_stanza*' + ngiorni + ' <= @costo; ',
                (err, results) => {
                    if(err) {
                        console.log(err);
                        return reject(new GeneralError('Si è verificato un errore'));
                    }
                    if(results.length < 1) {
                        return reject(new NotFound('Nessun alloggio corrisponde alla ricerca'));
                    }
                    
                    resolve(results[7]);
                }
            );
        }

        else {
            Connection.query(
                'SELECT @localita := "' + (req.localita === '' ? '%%' : req.localita) + '"; ' +
                'SELECT @provincia := "' + (req.provincia === '' ? '%%' : req.provincia) + '"; ' +
                'SELECT @posti := "' + req.posti + '"; ' +
                'SELECT @costo := ' + (req.costo === '' ? 99999 : req.costo) + '; ' +
                'SELECT @inizio := "'+ (req.checkIn === '' ? '1970-01-01' : req.checkIn) + '"; ' +
                'SELECT @fine := "'+ (req.checkOut === '' ? '1970-01-01' : req.checkOut) + '"; ' +
                'SELECT @servizi := "' + servizi + '"; ' +
                'SELECT DISTINCT p.nome_proprieta, p.indirizzo, p.localita, p.tipo_proprieta, p.servizi, p.provincia, ' +
                    'c.tariffa_casa* ' + ngiorni + ' AS costo, ' +
                    'c.tariffa_casa AS tariffa, ' +
                    'p.id_proprieta, p.ref_proprietario, ' +
                    ngiorni + ' AS ngiorni, ' +
                    'c.posti_letto AS posti, p.descrizione, ' +
                    'c.imgCV_path1 AS img1, ' +
                    'c.imgCV_path2 AS img2, ' +
                    'c.imgCV_path3 AS img3, ' +
                    'c.imgCV_path4 AS img4, ' +
                    'null AS check_in, ' +
                    'null AS check_out ' +
                'FROM proprieta p, casa_vacanza c ' +
                'WHERE p.id_proprieta = c.ref_proprieta_cv AND ' +
                    'LOWER(p.localita) LIKE LOWER(@localita) AND LOWER(p.provincia) LIKE LOWER(@provincia) AND ' +
                    'LOWER(p.servizi) LIKE LOWER(@servizi) AND ' + 
                    'c.posti_letto LIKE @posti AND ' +
                    '(@fine <= c.non_disponibile_inizio_cv OR @inizio >= c.non_disponibile_fine_cv) ' +
                'HAVING c.tariffa_casa*' + ngiorni + ' <= @costo; ',
                (err, results) => {
                    var resCV = results[7];

                    if(err) {
                        console.log(err);
                        return reject(new GeneralError('Si è verificato un errore'));
                    }
                    if(results.length < 1) {
                        return reject(new NotFound('Nessun alloggio corrisponde alla ricerca'));
                    }
                    
                    Connection.query(
                        'SELECT @localita := "' + (req.localita === '' ? '%%' : req.localita) + '"; ' +
                        'SELECT @provincia := "' + (req.provincia === '' ? '%%' : req.provincia) + '"; ' +
                        'SELECT @posti := "' + req.posti + '"; ' +
                        'SELECT @costo := ' + (req.costo === '' ? 99999 : req.costo) + '; ' +
                        'SELECT @inizio := "'+ (req.checkIn === '' ? '1970-01-01' : req.checkIn) + '"; ' +
                        'SELECT @fine := "'+ (req.checkOut === '' ? '1970-01-01' : req.checkOut) + '"; ' +
                        'SELECT @servizi := "' + servizi + '"; ' +
                        'SELECT DISTINCT p.nome_proprieta, p.indirizzo, p.localita, p.tipo_proprieta, p.provincia, p.servizi, ' +
                            's.tariffa_stanza* ' + ngiorni + ' AS costo, ' +
                            's.tariffa_stanza AS tariffa, ' +
                            ngiorni + ' AS ngiorni, ' +
                            'p.id_proprieta, p.ref_proprietario, ' +
                            's.tipologia AS posti, p.descrizione, ' +
                            's.imgST_path1 AS img1, ' +
                            's.imgST_path2 AS img2, ' +
                            's.imgST_path3 AS img3, ' +
                            's.imgST_path4 AS img4, ' +
                            'b.check_in AS check_in, ' +
                            'b.check_out AS check_out ' +
                        'FROM proprieta p, b_and_b b, stanza s ' +
                        'WHERE p.id_proprieta = b.ref_proprieta_bb AND b.ref_proprieta_bb = s.ref_bb AND ' +
                            'LOWER(p.localita) LIKE LOWER(@localita) AND LOWER(p.provincia) LIKE LOWER(@provincia) AND ' +
                            'LOWER(p.servizi) LIKE LOWER(@servizi) AND ' +
                            's.tipologia LIKE @posti AND ' +
                            '(@fine <= s.non_disponibile_inizio_st OR @inizio >= s.non_disponibile_fine_st) ' +
                        'HAVING s.tariffa_stanza*' + ngiorni + ' <= @costo; ',
                        (err, results) => {
                            if(err) {
                                console.log(err);
                                return reject(new GeneralError('Si è verificato un errore'));
                            }
                            if(results.length < 1) {
                                return reject(new NotFound('Nessun alloggio corrisponde alla ricerca'));
                            }
                            
                            var resBB = results[7];

                            var resTot = resCV.concat(resBB);

                            resolve(resTot);
                        }
                    );
                }
            );
        }
    });
}

// get proprieta from ref_proprietario
const getProprietaProprietario = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT * ' +
            'FROM proprieta ' +
            'WHERE ref_proprietario = "' +  req.ref_proprietario + '"', (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessun alloggio corrisponde alla ricerca'));
                }
            resolve(results);
        });
    });
}

// get proprieta from tipo_proprieta = cv && ref_proprietario
const getProprietaCVProprietario = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT * ' +
            'FROM proprieta, casa_vacanza ' +
            'WHERE id_proprieta = ref_proprieta_cv AND ' +
            'tipo_proprieta = "' +  req.tipo_proprieta + '" AND ref_proprietario = "' + req.ref_proprietario + '"; ', 
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessun alloggio corrisponde alla ricerca'));
                }
            resolve(results);
        });
    });
}

// get proprieta from tipo_proprieta = bb && ref_proprietario
const getProprietaBBProprietario = async(req) => {
    return new Promise((resolve, reject) => {

        Connection.query(
            'SELECT * ' +
            'FROM proprieta, b_and_b ' +
            'WHERE id_proprieta = ref_proprieta_bb AND ' +
            'tipo_proprieta = "' +  req.tipo_proprieta + '" AND ref_proprietario = "' + req.ref_proprietario + '"; ', 
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Nessun alloggio corrisponde alla ricerca'));
                }
            resolve(results);
        });
    });
}

// update fields
const updateProprieta= async(req) => {

    var servizi = '';
    for(var i = 0; i < req.servizi.length; i++) {
        if(i < req.servizi.length-1) {
            servizi = servizi + req.servizi[i] + ', ';
        }
        else {
            servizi = servizi + req.servizi[i];
        }
    }
    
    return new Promise((resolve, reject) => {

        Connection.query(
            'UPDATE proprieta ' +
            'SET nome_proprieta = "' + req.nome_proprieta + '", indirizzo = "' + req.indirizzo +
            '", localita = "' + req.localita + '", provincia = "' + req.provincia +
            '", tipo_proprieta = "' + req.tipo_proprieta + '", servizi = "' + req.servizi + '", ref_proprietario = "' + req.ref_proprietario +
            '", descrizione = "' + req.descrizione + '" ' +
            'WHERE id_proprieta= ' + req.id_proprieta+ '; ',
            (err, results) => {
                if(err) {
                    console.log(err);
                    return reject(new GeneralError('Si è verificato un errore'));
                }
                if(results.length < 1) {
                    return reject(new NotFound('Proprietà non trovata'));
                }
                resolve(results);
            }
        );
    });
}

module.exports = {
    insertProprieta,
    ricercaAlloggio,
    getProprietaProprietario,
    getProprietaCVProprietario,
    getProprietaBBProprietario,
    updateProprieta
}