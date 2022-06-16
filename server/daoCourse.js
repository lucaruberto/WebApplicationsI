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
exports.addPlanFlag = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE User SET plan=? WHERE id = ?';
        db.run(sql, [1, userId], function (err) {  // <-- NB: function, NOT arrow function so this.lastID works
            if (err) {
                reject(err);
                return;
            }
        });
        resolve(null);
    });
};
exports.getPlanExists = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT plan FROM User WHERE id = ?';
        db.get(sql, [userId], function (err, row) {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                resolve({ error: 'PlanExists not found.' });
            } else {
                resolve(row);
            }
        });
    });
};

exports.getPlan = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Codice, Nome, Crediti FROM Course JOIN Plan WHERE Plan.course = Course.Codice AND userid = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined) {
                resolve({ error: 'Courses not found.' });
            } else {
                const plan = rows.map((c) => (
                    {
                        codice: c.Codice,
                        nome: c.Nome,
                        crediti: c.Crediti
                    }
                ))
                resolve(plan);
            }
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