import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { LoginForm } from './components/LoginComponents';
import { Container } from 'react-bootstrap/';
import { useEffect, useState } from 'react';
import API from './API';
import { CoursesList, PlanPage } from './components/CoursesList';
import { PlanComponents } from './components/PlanComponents.js';

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}
function App2() {
  const [courses, setCourses] = useState([]); //Lista di corsi versione Client-Server
  const [loggedIn, setLoggedIn] = useState(false);  // no user is logged in when app loads
  const [user, setUser] = useState({});
  const [planExists, setPlanExists] = useState('');
  const [planCfu, setPlanCfu] = useState(0);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);
  const [onAdd, setOnAdd] = useState(false);
  const [time, setTime] = useState(''); /* 1 = Full Time, 0 = Part Time */
  const [plan, setPlan] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [actualPlan, setActualPlan] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);

  /*useEffect(() => {
    if (loggedIn)
      API.getAllCourses()
        .then((courses) => { setCourses(courses); setDirty(true); })
        .catch(err => handleError(err))
  }, [loggedIn])*/

  function addCoursePlan(course) {
    incrementCfu(course.crediti);
    setPlan(oldPlan => [...oldPlan, course]);
  }
  /* Dovrei controllare se ci sono propedeuticità */
  function deleteFromPlan(course) {
    if (plan.some((c) => c.propedeuticità === course.codice)) {
      setMessage("Non è possibile cancellare l'esame per propedeuticità");
    }
    else {
      setPlan((oldPlan) => oldPlan.filter((c) => c.codice !== course.codice));
      decrementCfu(course.crediti);
    }
  }
  useEffect(() => {
    if (loggedIn) {
      /*Funzione che conta il numero di crediti  */
      API.getPlanExists().then((p) => { if (p > 0) setPlanExists(p) }).catch(err => handleError(err));;
      API.getPlanCfu().then((c) => { setPlanCfu(c) }).catch(err => handleError(err));
      API.getEnrolled().then((c) => setEnrolled(c)).catch(err => handleError(err));
      //console.log(enrolled);
      API.getPlan().then((plan) => setActualPlan(plan))
        .catch(err => handleError(err));
    }
  }, [loggedIn, onAdd, time]);

  /* useEffect(() => {
    if (!loggedIn) {
      //(plan) => setPlan(plan)  
      setOnAdd(false);
    }
  }, [loggedIn]); */

  function addPlan(plan, time) {
    API.addPlan(plan, time).then(() => { setTime(0); setPlanCfu("") })
      .catch(err => handleError(err));
  };
  function deletePlan() {
    API.deletePlan()
      .catch(err => handleError(err));
  };
  function incrementCfu(cfu) {
    setPlanCfu(i => i + cfu);
  }
  function decrementCfu(cfu) {
    setPlanCfu(i => i - cfu);
  }
  useEffect(() => {
    /* setCourses(list.nome.sort((Architetture, Database) => Architetture - Database))  */
    API.getAllCourses().then((list) => { setCourses(list) })
      .catch(err => handleError(err))
  }, [loggedIn])

  function handleError(err) {
    console.log(err);
  }

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('Logged');
        navigate('/home-logged');
      })
      .catch(err => {
        setMessage(err);
      }
      )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    navigate('/');
  }
  return (
    <>
      <Routes>
        <Route path='/' element={<CoursesList courses={courses} loggedIn={loggedIn} logout={doLogOut} user={user} plan={plan} />} />
        <Route path='/login' element={loggedIn ? <Navigate to='/home-logged' /> : <LoginForm login={doLogIn} />} />
        <Route path='/home-logged' element={loggedIn ? <PlanPage courses={courses} loggedIn={loggedIn} logout={doLogOut} user={user}
          planExists={planExists} setPlanExists={setPlanExists} time={time} setTime={setTime} actualPlan={actualPlan} deletePlan={deletePlan}
          onAdd={onAdd} setOnAdd={setOnAdd} planCfu={planCfu} addCoursePlan={addCoursePlan} plan={plan} incrementCfu={incrementCfu}
          setPlan={setPlan} deleteFromPlan={deleteFromPlan} decrementCfu={decrementCfu} addPlan={addPlan} enrolled={enrolled}
        /> : <Navigate to='/login' />} >
        </Route>
      </Routes>

    </>
  );
}

export default App;
