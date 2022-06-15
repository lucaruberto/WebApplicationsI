/* All the API calls */

const APIURL = new URL('http://localhost:3001/api/');

async function getAllCourses() {
    // Call  /api/courses
    const response = await fetch(new URL('courses', APIURL));
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map((c) => ({
            codice: c.codice, nome: c.nome, crediti: c.crediti, iscritti: c.iscritti, maxstudenti: c.maxstudenti === null ? 0 : c.maxstudenti,
            incompatibilità: c.incompatibilità === null ? 0 : c.incompatibilità, propedeuticità: c.propedeuticità === null ? 0 : c.propedeuticità
        }))
    } else {
        throw coursesJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
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

const API = { getAllCourses, logIn, logOut, getUserInfo, addPlan };
export default API;