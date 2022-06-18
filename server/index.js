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
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
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
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

// GET /api/courses
app.get('/api/courses', (req, res) => {
  dao.listCourses()
    .then(courses => res.json(courses))
    .catch(() => res.status(500).end());
});

// GET /api/plan
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
// GET /api/planCfu
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
// GET /api/enrolled
app.get('/api/enrolled', isLoggedIn, async (req, res) => {
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
      //console.log(cnt);
    }
    if (cnt.error)
      res.status(404).json(cnt);
    else
      res.json(cnt);
  } catch (err) {
    res.status(500).end();
  }
});
// POST /api/plan
app.post('/api/plan', isLoggedIn, [check('plan').isArray()
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
    // res.status(503).json({error: `Database error during the creation of exam ${plan.code}.`});
  }
});

// DELETE /api/plan/:course
app.delete('/api/plan/:course', isLoggedIn, async (req, res) => {
  try {
    await dao.deletePlanCourse(req.params.code, req.user.id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the deletion of course from a Plan ${req.params.code}.` });
  }
});

// DELETE /api/plan/
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
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
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