/* All the API calls */

const URL = 'http://localhost:3001/api'

async function getAllCourses() {
    // Call  /api/courses
    const response = await fetch(URL + '/courses');
    const coursesJson = await response.json();
    if (response.ok) {

        //console.log(coursesJson)
        return coursesJson.map((c) => ({ codice: c.codice, nome: c.nome, crediti: c.crediti, maxstudenti: c.maxstudenti === null ? 0 : c.maxstudenti, incompatibilità: c.incompatibilità === null ? 0 : c.incompatibilità, propedeuticità: c.propedeuticità === null ? 0 : c.propedeuticità }))
    } else {
        throw coursesJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
}


const API = { getAllCourses };
export default API;