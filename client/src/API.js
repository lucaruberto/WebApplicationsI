/* All the API calls */

const APIURL = new URL('http://localhost:3001/api/');

async function getAllCourses() {
    // Call  /api/courses
    const response = await fetch(new URL('courses', APIURL));
    const coursesJson = await response.json();
    let courses = coursesJson.map((c) => ({
        codice: c.codice, nome: c.nome, crediti: c.crediti, iscritti: c.iscritti === null ? 0 : c.iscritti, maxstudenti: c.maxstudenti === null ? 0 : c.maxstudenti,
        incompatibilità: c.incompatibilità === null ? 0 : c.incompatibilità, propedeuticità: c.propedeuticità === null ? 0 : c.propedeuticità
    })).sort(function (a, b) {
        const nomeA = a.nome.trim().toUpperCase();
        const nomeB = b.nome.trim().toUpperCase();
        if (nomeA < nomeB) {
            return -1;
        }
        if (nomeA > nomeB) {
            return 1;
        }
        return 0;
    });;

    if (response.ok) {
        return courses;
    } else {
        throw coursesJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
}

async function getPlan() {
    const response = await fetch(new URL('plan', APIURL), { credentials: 'include' });
    const planJson = await response.json();
    if (response.ok) {
        return planJson.map((c) => ({ codice: c.codice, nome: c.nome, crediti: c.crediti }))
    } else {
        throw planJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
}

async function getPlanExists() {
    const response = await fetch(new URL('planExists', APIURL), { credentials: 'include' });
    const planExists = await response.json();
    const p = planExists.plan;
    if (response.ok) {
        return p
    } else {
        throw p;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
}

function addPlan(plan) {
    return new Promise((resolve, reject) => {
        fetch(new URL('plan', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan: plan
            }),
        })
            .then((response) => {
                if (response.ok) {
                    resolve(null);
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });


}
async function logIn(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL), { credentials: 'include' });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

const API = { getAllCourses, logIn, logOut, getUserInfo, addPlan, getPlan, getPlanExists };
export default API;