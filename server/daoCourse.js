'use strict';
const sqlite = require('sqlite3');

// Open the database
const db = new sqlite.Database('course.db', (err) => {
    if (err) throw err;
});


// Get all courses
exports.listCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Course';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            //console.log(rows);
            const films = rows.map((c) => ({
                codice: c.Codice, nome: c.Nome, crediti: c.Crediti, maxstudenti: c.MaxStudenti, incompatibilità: c.Incompatibilità, propedeuticità: c.Propedeuticità
            }));
            resolve(films);
        });
    });
};