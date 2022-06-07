import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Router, Routes, Route, Navigate, useNavigate, BrowserRouter } from 'react-router-dom';
import './App.css';
import { Container } from 'react-bootstrap/';
import { useEffect, useState, navigate } from 'react';
import API from './API';
import { CoursesList } from './components/CoursesList';


function App() {
  const [courses, setCourses] = useState([]); //Lista di film versione Client-Server


  useEffect(() => {

    API.getAllCourses().then((list) => { setCourses(list) })
      .catch(err => handleError(err))
  }, [])
  function handleError(err) {
    console.log(err);
  }
  return (
    <>
      <BrowserRouter>
        <Container fluid className="App">
          <Routes>
            <Route path='/' element={<CoursesList courses={courses} />} />
            <Route path='/home' />
          </Routes>
        </Container>
      </BrowserRouter>

    </>
  );
}

export default App;
