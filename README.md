# Exam #1: "Piano di studi"

## Student: s305902 RUBERTO LUCA

## React Client Application Routes

- Route `/`: Pagina principale, accessibile e visualizzabile senza login
- Route `/login`: Pagina di login
- Route `/home-logged` : Pagina personale in cui è possibile visualizzare/creare anche il piano di studi dopo aver effettuato il login
- Route `*` : Pagina a cui si è indirizzati in seguito a link non valido, viene mostrata una pagina di errore

## API Server

- GET `/api/courses`

  - request parameters and request body content: -
  - response body content: Array di oggetti, ciascuno rappresenta un corso:

  ```json
  [
  {
    "codice": "01UDFOV",
    "nome": "Applicazioni Web I",
    "crediti": 6,
    "iscritti": 2,
    "maxstudenti": "",
    "incompatibilità": "01TXYOV",
    "propedeuticità": "02GOLOV",

  },
  {
   "codice": "02GOLOV",
    "nome": "	Architetture dei sistemi di elaborazione",
    "crediti": 12,
    "iscritti": 2,
    "maxstudenti": "",
    "incompatibilità": "02LSEOV",
    "propedeuticità": "",
  },
  ...
  ]

  ```

- GET `/api/plan`

  - request parameters and request body content: -
  - response body content: Array di oggetti, ciascuno rappresenta un corso presente nel piano di studi:

  ```json
  [
  {
    "codice": "01UDFOV",
    "nome": "Applicazioni Web I",
    "crediti": 6,
    "iscritti": 2,
    "maxstudenti": "",
    "incompatibilità": "01TXYOV",
    "propedeuticità": "02GOLOV",

  },
  {
   "codice": "02GOLOV",
    "nome": "	Architetture dei sistemi di elaborazione",
    "crediti": 12,
    "iscritti": 2,
    "maxstudenti": "",
    "incompatibilità": "02LSEOV",
    "propedeuticità": "",
  },
  ...
  ]

  ```

- GET `/api/planExists`
  - request parameters and request body content: -
  - response body content: Oggetto contentente il campo plan che indica se il piano è part time(1), full time(2), o non esiste(0)

```json
{
  "plan": 1
}
```

- GET `/api/planCfu`
  - request parameters and request body content: -
  - response body content: Array di oggetti contententi cfu ossia il numero di cfu del piano

```json
[
  {
    "cfu": 41
  }
]
```

- GET `/api/enrolled`
  - request parameters and request body content: -
  - response body content: Array di array contententi oggetti contententi cnt ossia il numero di iscritti a quel corso

```json
[
    [
        {
            "cnt": 3
        }
    ],
    [
        {
            "cnt": 2
        }
    ],
  ...
]
```

- POST `/api/plan`
  - request parameters and request body content:

```json
  { "plan": [
  {
    "codice": "02KPNOV",
    "nome": "Tecnologie e servizi di rete",
    "crediti": 6,
    "maxstudenti": 3,
    "incompatibilità": "" ,
    "propedeuticità": ""
  },
  {
    "codice": "01TYDOV",
    "nome": "Software networking",
    "crediti": 7,
    "maxstudenti": "",
    "incompatibilità": "",
    "propedeuticità": ""
  },
    ...
  ],
  "time": 1
  }
```

- response body content: : L'oggetto come è salvato nel database

- POST `/api/planUpdate`

  - request parameters and request body content

  ```json
  { "plan": [
  {
    "codice": "02KPNOV",
    "nome": "Tecnologie e servizi di rete",
    "crediti": 6,
    "maxstudenti": 3,
    "incompatibilità": "" ,
    "propedeuticità": ""
  },
  {
    "codice": "01TYDOV",
    "nome": "Software networking",
    "crediti": 7,
    "maxstudenti": "",
    "incompatibilità": "",
    "propedeuticità": ""
  },
    ...
  ],
  "time": 1
  }
  ```

  - response body content: : L'oggetto come è salvato nel database

- DELETE `/api/plan`

  - request parameters and request body content: -
  - response body content: Oggetto vuoto

- POST `/api/sessions`

  - request parameters and request body content

  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```

  - response body content: authenticated user

- DELETE `/api/sessions/current`

  - request parameters and request body content: -
  - response body content: -

- GET `/api/sessions/current`
  - request parameters and request body content: -
  - response body content: authenticated user

## Database Tables

- Table `Course` - Contiene ( Codice, Nome, Crediti, Max Studenti, Incompatibilità, Propedeuticità) per ogni corso selezionabile nel plano
- Table `Plan` - Contiene (userid, course) coppia univoca che associa l'esame ad un certo utente, nelle righe sono presenti più coppie con lo stesso userid ma diverso course che formano il piano di studi
- Table `User` - Contiene (id, email, password, name, salt, plan) per ogni utente, plan=-1 indica che non esiste un piano per quello studente, plan=1 (piano Part-Time), plan=2 (piano Full Time)

## Main React Components

- `Navbar` (in `CourseList.js`): Navbar con pulsanti per Home, Pagina Personale e Login/Logout
- `Login/logout` (in `CourseList.js`): Pulsanti per effettuare il login/logout
- `Accordion` (in `CourseList.js`): Componente utilizzato per mostrare i dettagli degli esami incompatibili/propedeutici
- `Alert` (in `CourseList.js`): Componente che mostra gli errori dopo il tentativo di salvataggio del piano
- `Form` (in `CourseList.js`): Componente per fare check(inserimento) di un esame nel piano, può essere disabilitato in seguito ad interazioni
- `Button (Crea)` (in `CourseList.js`): Puslante per accedere alla pagina di creazione del piano dopo aver scelto la tipologia di piano
- `Button (Salva, Annulla)` (in `PlanComponents.js`): (Piano non esistente) Rispettivamente salvano il Piano (in modo definitivo se rispetta tutti i parametri) e svuotano il piano in fase di creazione tornando alla pagina di scelta della tipologia di piano
- `Button (Salva, Annulla, Elimina)` (in `PlanComponents.js`): (Piano esistente) Rispettivamente aggiornano il Piano (in modo definitivo se rispetta tutti i parametri), annullano le modifiche fatte al piano esistente ed eliminano il piano definitivamente
- `Stack` (in `PlanComponents.js`): Visualizza i vari numeri di cfu orizzontalmente

## Screenshot

![Screenshot](/client/img/screenshot.jpg)

## Users Credentials

- luca@studenti.polito.it, password (Piano Part Time esistente)
- maria@studenti.polito.it, password (Piano Full Time esistente)
- paolo@studenti.polito.it, password (Piano Full Time esistente)
- sara@studenti.polito.it, password (Piano Part Time esistente)
- francesco@studenti.polito.it, password
- martina@studenti.polito.it, password
- anna@studenti.polito.it, password

```

```
