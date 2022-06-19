'use strict';
const sqlite = require('sqlite3');

// Open the database
const db = new sqlite.Database('course.sqlite', (err) => {
    if (err) throw err;
});

/* Get all courses */
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

/* Set plan to 1 (Part Time) or to 2 (Full Time) */
exports.addPlanFlag = (userId, time) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE User SET plan=? WHERE id = ?';
        db.run(sql, [time, userId], function (err) {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve(null);
    });
};

/* Check if a Plan exists */
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

/* Get the number of cfu in the Plan */
exports.getPlanCfu = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT SUM(Crediti) as cfu FROM Course JOIN Plan WHERE userid = ? AND Plan.course=Course.Codice';
        db.all(sql, [userId], function (err, row) {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                resolve({ error: 'Cfu not found.' });
            } else {
                resolve(row);
            }
        });
    });
};

/* Get the number of enrolled people in a course */
exports.getEnrolled = (course) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) as cnt FROM Plan WHERE course= ?';
        db.all(sql, [course], function (err, row) {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                resolve({ error: 'Cnt not found.' });
            } else {
                resolve(row);
            }
        });
    });
};

/* Get the entire Plan */
exports.getPlan = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Codice, Nome, Crediti, Incompatibilità, Propedeuticità FROM Course JOIN Plan WHERE Plan.course = Course.Codice AND userid = ?';
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
                        crediti: c.Crediti,
                        maxstudenti: c.MaxStudenti,
                        incompatibilità: c.Incompatibilità,
                        propedeuticità: c.Propedeuticità
                    }
                ))
                resolve(plan);
            }
        });
    });
};
/* Insert new course in the Plan */
exports.createPlan = (course, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Plan(userId, course) VALUES(?, ?)';
        db.run(sql, [userId, course], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};
/* Delete a course from Plan */
exports.deleteCourse = (course, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Plan WHERE course = ? AND userid = ?';
        db.run(sql, [course, userId], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(course);
        });
    });
}
/* Delete the Plan */
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