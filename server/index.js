'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./daoCourse'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./daoUser'); // module for accessing the users in the DB
const cors = require('cors');
/*** Set up Passport ***/

passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

/* GET */

/* GET /api/courses */
app.get('/api/courses', (req, res) => {
  dao.listCourses()
    .then(courses => res.json(courses))
    .catch(() => res.status(500).end());
});

/* GET /api/plan */
app.get('/api/plan', isLoggedIn, async (req, res) => {
  try {
    const result = await dao.getPlan(req.user.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

/* GET /api/planExists */
app.get('/api/planExists', isLoggedIn, async (req, res) => {
  try {
    const result = await dao.getPlanExists(req.user.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

/* GET /api/planCfu */
app.get('/api/planCfu', isLoggedIn, async (req, res) => {
  try {
    const result = await dao.getPlanCfu(req.user.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

/* GET /api/enrolled */
app.get('/api/enrolled', async (req, res) => {
  try {
    let cnt = [];
    let courses = await dao.listCourses();
    courses = courses.sort(function (a, b) {
      const nomeA = a.nome.trim().toUpperCase();
      const nomeB = b.nome.trim().toUpperCase();
      if (nomeA < nomeB) {
        return -1;
      }
      if (nomeA > nomeB) {
        return 1;
      }
      return 0;
    });;;
    for (let c of courses) {
      cnt.push(await dao.getEnrolled(c.codice));
    }
    if (cnt.error)
      res.status(404).json(cnt);
    else
      res.json(cnt);
  } catch (err) {
    res.status(500).end();
  }
});

/* POST */

/* POST /api/plan */
app.post('/api/plan', isLoggedIn, [check('plan').isArray(),
check('plan.*.codice').isLength({ min: 7, max: 7 }),
check('plan.*.crediti').isInt(),
check('plan.*.nome').isLength({ min: 1, max: 160 }),
check('plan').custom((c, { req }) => {
  let i = 0;
  i = c.reduce((a, b) => a + b.crediti, 0);
  if (req.body.time === 1) {
    if (i < 20 || i > 40)
      throw new Error("Numero di crediti non valido per Part Time");
    else return true;
  }
  else if (req.body.time === 2) {
    if (i < 60 || i > 80) {
      throw new Error("Numero di crediti non valido per Full Time");
    }
    else return true;
  }
  return new Error("Non selezionato Part Time o Full Time");
}),
check('plan.*.propedeuticità').optional({ checkFalsy: true }).custom((p, { req }) => {

  if (!req.body.plan.some((x) => x.codice === p)) {
    throw new Error("Manca l'esame propedeutico " + p);
  }
  else return true;
}
),
check('plan.*.incompatibilità').optional({ checkFalsy: true }).custom((i, { req }) => {
  if (req.body.plan.some((x) => i.indexOf(x.codice) !== -1)) {
    throw new Error("Esame incompatibile");
  }
  else return true;
}),
check('plan.*').optional({ checkFalsy: true }).custom(async (c, { req }) => {
  const iscritti = await dao.getEnrolled(c.codice);

  if (c.maxstudenti > 0 && iscritti[0].cnt > c.maxstudenti)
    throw new Error("Numero iscritti superato");
  return true;
}),
check('plan.*.codice').custom(async (c, { req }) => {
  const plan = await dao.getPlan(req.user.id)
  if (plan.some((x) => x.codice === c))
    throw new Error("Esame già presente nel piano di studi");
  else return true;
}
)

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    for (let c of req.body.plan) {
      await dao.createPlan(c.codice, req.user.id);
    }
    await dao.addPlanFlag(req.user.id, req.body.time);
    res.status(201).end();
  } catch (err) {
    console.log(err);
  }
});

/* POST /api/planUpdate */
app.post('/api/planUpdate', isLoggedIn, [
  check('plan').isArray(),
  check('plan.*.codice').isLength({ min: 7, max: 7 }),
  check('plan.*.crediti').isInt(),
  check('plan.*.nome').isLength({ min: 1, max: 160 }),
  check('plan').custom((c, { req }) => {
    let i = 0;
    i = c.reduce((a, b) => a + b.crediti, 0);
    if (req.body.time === 1) {
      if (i < 20 || i > 40)
        throw new Error("Numero di crediti non valido per Part Time");
      else return true;
    }
    else if (req.body.time === 2) {
      if (i < 60 || i > 80) {
        throw new Error("Numero di crediti non valido per Full Time");
      }
      else return true;
    }
    return new Error("Non selezionato Part Time o Full Time");
  }),
  check('plan.*.propedeuticità').optional({ checkFalsy: true }).custom((p, { req }) => {

    if (!req.body.plan.some((x) => x.codice === p)) {
      throw new Error("Manca l'esame propedeutico " + p);
    }
    else return true;
  }
  ),
  check('plan.*.incompatibilità').optional({ checkFalsy: true }).custom((i, { req }) => {
    if (req.body.plan.some((x) => i.indexOf(x.codice) !== -1)) {
      throw new Error("Esame incompatibile");
    }
    else return true;
  }),
  check('plan.*').optional({ checkFalsy: true }).custom(async (c, { req }) => {
    const iscritti = await dao.getEnrolled(c.codice);

    if (c.maxstudenti > 0 && iscritti[0].cnt > c.maxstudenti)
      throw new Error("Numero iscritti superato");
    return true;
  }),
], async (req, res) => {
  let padd = [];
  let pdel = [];
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const p = await dao.getPlan(req.user.id);

    for (let c of req.body.plan) {
      if (!p.some((d) => c.codice === d.codice)) {
        padd.push(c.codice);
      }
    }
    for (let c of p) {
      if (!req.body.plan.some((d) => c.codice === d.codice)) {
        pdel.push(c.codice);
      }
    }
    for (let c of padd) {
      await dao.createPlan(c, req.user.id);
    }
    for (let c of pdel) {
      await dao.deleteCourse(c, req.user.id);
    }
    res.status(201).end();
  } catch (err) {
    console.log(err);
  }
});
/* DELETE */

/* DELETE /api/plan/ */
app.delete('/api/plan', isLoggedIn, async (req, res) => {
  try {
    await dao.deletePlan(req.user.id);
    await dao.addPlanFlag(req.user.id, -1);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the deletion of Plan for the user ${req.user.id}.` });
  }
});

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      return res.json(req.user);
    });
  })(req, res, next);
});



// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});