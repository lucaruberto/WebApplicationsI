import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Router, Routes, Route, Navigate, useNavigate, BrowserRouter } from 'react-router-dom';
import './App.css';
import { LoginForm, LogoutButton } from './components/LoginComponents';
import { Container } from 'react-bootstrap/';
import { useEffect, useState, navigate } from 'react';
import API from './API';
import { CoursesList } from './components/CoursesList';


function App() {
  const [courses, setCourses] = useState([]); //Lista di corsi versione Client-Server
  const [loggedIn, setLoggedIn] = useState(false);  // no user is logged in when app loads
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);
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
    if (loggedIn)
      API.getAllCourses()
        .then((courses) => { setCourses(courses); setDirty(true); })
        .catch(err => handleError(err))
  }, [loggedIn])

  useEffect(() => {

    API.getAllCourses().then((list) => { setCourses(list) })
      .catch(err => handleError(err))
  }, [])

  function handleError(err) {
    console.log(err);
  }

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/');
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
  }
  return (
    <>
      <BrowserRouter>
        <Container fluid className="App">
          <Routes>
            <Route path='/' element={<CoursesList courses={courses} />} />
            <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginForm login={doLogIn} />} />
            <Route path='/home-logged ' />
          </Routes>
        </Container>
      </BrowserRouter>

    </>
  );
}

export default App;
