import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { LoginForm, LogoutButton } from './components/LoginComponents';
import { Container } from 'react-bootstrap/';
import { useEffect, useState } from 'react';
import API from './API';
import { CoursesList, PlanPage } from './components/CoursesList';
import { PlanComponents } from './components/PlanComponents';
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
  const [planExists, setPlanExists] = useState(false);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);
  const [onAdd, setOnAdd] = useState(false);
  const [time, setTime] = useState(0); /* 1 = Full Time, 0 = Part Time */
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CheckAut: " + loggedIn);
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

  useEffect(() => {
    console.log("GetAll: " + loggedIn);
    API.getAllCourses().then((list) => { setCourses(list) })
      .catch(err => handleError(err))
  }, [])

  function handleError(err) {
    console.log(err);
  }

  const doLogIn = (credentials) => {
    console.log("Here");
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
        <Route path='/' element={<CoursesList courses={courses} loggedIn={loggedIn} logout={doLogOut} user={user} />} />
        <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginForm login={doLogIn} />} />
        <Route path='/home-logged' element={<PlanPage courses={courses} loggedIn={loggedIn} logout={doLogOut} user={user}
          planExists={planExists} setPlanExists={setPlanExists} time={time} setTime={setTime}
          onAdd={onAdd} setOnAdd={setOnAdd} />} >
          <Route path='add' element={<PlanComponents setOnAdd={setOnAdd} courses={courses} loggedIn={loggedIn} logout={doLogOut} user={user} />} />
        </Route>
      </Routes>

    </>
  );
}

export default App;
