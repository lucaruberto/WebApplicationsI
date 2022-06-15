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
            const courses = rows.map((c) => ({
                codice: c.Codice, nome: c.Nome, crediti: c.Crediti, iscritti: c.Iscritti,
                maxstudenti: c.MaxStudenti, incompatibilità: c.Incompatibilità, propedeuticità: c.Propedeuticità
            }));
            resolve(courses);
        });
    });
};

exports.createPlan = (course, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Plan(userId, course) VALUES(?, ?)';
        db.run(sql, [userId, course], function (err) {  // <-- NB: function, NOT arrow function so this.lastID works
            if (err) {
                reject(err);
                return;
            }
            //console.log('createExam lastID: ' + this.lastID);
            resolve(this.lastID);
        });
    });
};

exports.deletePlanCourse = (course, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Plan WHERE course = ? AND userid = ?';
        db.run(sql, [course, userId], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}

exports.deletePlan = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Plan WHERE userId = ?';
        db.run(sql, [userId], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}