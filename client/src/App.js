import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { LoginForm } from './components/LoginComponents';
import { useEffect, useState } from 'react';
import API from './API';
import { CoursesList, PlanPage } from './components/CoursesList';
import { NoMatch } from './components/NoMatch'
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
  const [planExists, setPlanExists] = useState(0);
  const [planCfu, setPlanCfu] = useState(0);
  const [backupCfu, setBackupCfu] = useState(0);
  const [message, setMessage] = useState('');
  const [onAdd, setOnAdd] = useState(false);
  const [time, setTime] = useState(''); /* 2 = Full Time, 1 = Part Time */
  const [plan, setPlan] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [actualPlan, setActualPlan] = useState([]);
  const [backupPlan, setBackupPlan] = useState([]);
  const [messageLog, setMessageLog] = useState('');
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState('');
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

  useEffect(() => {
    API.getAllCourses().then((list) => { setCourses(list) })
      .catch(err => handleError(err))
  }, []);

  useEffect(() => {
    if (loggedIn) {
      API.getPlanExists().then((p) => { if (p > 0) { setPlanExists(p) } else { setPlanExists(0) } }).catch(err => handleError(err));
      API.getPlanCfu().then((c) => { setPlanCfu(c); setBackupCfu(c) }).catch(err => handleError(err));
      API.getPlan().then((plan) => { setActualPlan(plan); setBackupPlan(plan); })
        .catch(err => handleError(err));
    }
  }, [loggedIn, onAdd]);

  useEffect(() => {
    if (loggedIn) {
      API.getEnrolled().then((c) => setEnrolled(c)).catch(err => handleError(err));
    }

  }, [loggedIn, onAdd, time, planCfu]);

  function addCoursePlan(course, planExists) {
    if (planExists) {
      incrementCfu(course.crediti);
      setActualPlan(oldPlan => [...oldPlan, course]);
    }
    else {

      incrementCfu(course.crediti);
      setPlan(oldPlan => [...oldPlan, course]);
    }
  }

  function deleteFromPlan(course) {
    if (!planExists) {
      if (plan.some((c) => c.propedeuticità === course.codice)) {
        setVariant("danger");
        setMessage("Non è possibile cancellare l'esame per propedeuticità");
      }
      else {
        setPlan((oldPlan) => oldPlan.filter((c) => c.codice !== course.codice));
        decrementCfu(course.crediti);
        setVariant("success");
        setMessage("Corso eliminato dal piano");
      }
    }
    else {
      if (actualPlan.some((c) => c.propedeuticità === course.codice)) {
        setVariant("danger");
        setMessage("Non è possibile cancellare l'esame per propedeuticità");
      }
      else {
        setActualPlan((oldPlan) => oldPlan.filter((c) => c.codice !== course.codice));
        decrementCfu(course.crediti);
        setVariant("success");
        setMessage("Corso eliminato dal piano");
      }
    }
  }

  function addPlan(plan, time) {
    API.addPlan(plan, time).then(() => { setTime(0); setPlan([]); setPlanExists(time); setOnAdd(false); setVariant("success"); setMessage("Piano di studi correttamente salvato") })
      .catch(err => handleError(err));
  };

  function updatePlan(plan) {
    API.updatePlan(plan).then(() => { setVariant("success"); setMessage("Piano di studi correttamente aggiornato") })
      .catch(err => handleError(err));
  };

  function deletePlan(time) {
    API.deletePlan().then(() => { setPlanExists(-1); setPlanCfu(0); setOnAdd(false); setActualPlan([]); setPlan([]); setVariant("success"); setMessage("Piano di studi correttamente eliminato") })
      .catch(err => handleError(err));
  };

  function incrementCfu(cfu) {
    setPlanCfu(i => i + cfu);
  };

  function decrementCfu(cfu) {
    setPlanCfu(i => i - cfu);
  };

  function handleError(err) {
    console.log(err);
  };

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        navigate('/home-logged');
      })
      .catch(err => {
        setMessageLog(err);
        setShow(true);
      }
      )
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    navigate('/');
  };

  return (
    <>
      <Routes>
        <Route path='/' element={<CoursesList courses={courses} loggedIn={loggedIn} logout={doLogOut} user={user} plan={plan} enrolled={enrolled} />} />
        <Route path='/login' element={loggedIn ? <Navigate to='/home-logged' /> : <LoginForm login={doLogIn} messageLog={messageLog} setMessageLog={setMessageLog} show={show} setShow={setShow} />} />

        <Route path='/home-logged' element={loggedIn ? <PlanPage courses={courses} loggedIn={loggedIn} logout={doLogOut} user={user} message={message} setMessage={setMessage} variant={variant}
          planExists={planExists} setPlanExists={setPlanExists} time={time} setTime={setTime} deletePlan={deletePlan} backupPlan={backupPlan} setActualPlan={setActualPlan} setVariant={setVariant}
          onAdd={onAdd} setOnAdd={setOnAdd} planCfu={planCfu} addCoursePlan={addCoursePlan} plan={plan} actualPlan={actualPlan} incrementCfu={incrementCfu} setPlanCfu={setPlanCfu}
          setPlan={setPlan} deleteFromPlan={deleteFromPlan} decrementCfu={decrementCfu} addPlan={addPlan} enrolled={enrolled} updatePlan={updatePlan} backupCfu={backupCfu}
        /> : <Navigate to='/login' />} />
        <Route path="*" element={
          <NoMatch />
        } />
      </Routes>
    </>
  );
}

export default App;
