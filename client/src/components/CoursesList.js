import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Table, Row, Col, Button, Navbar, Form, FormControl, NavDropdown, Nav, Fade, Collapse, Accordion } from "react-bootstrap";
import React from "react";
import { BsCollectionPlay } from "react-icons/bs";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogoutButton } from './LoginComponents';

function PlanPage(props) {
    return (
        <>
            <Container fluid  >

                <CoursesList courses={props.courses} loggedIn={props.loggedIn} logout={props.doLogOut} user={props.user} />
                <Row xs={2}> Ciao</Row>
            </Container>

        </>)
}

function CoursesList(props) {
    const navigate = useNavigate();

    return (
        <>
            <Container fluid>
                <Row>
                    <Navbar bg="warning" expand="sm" variant="dark" fixed="top" className="navbar-padding">

                        <Navbar.Brand >
                            <BsCollectionPlay />{" "} Politecnico di Torino
                        </Navbar.Brand>
                        <Nav.Link href="/" style={{ color: "white" }} >Home</Nav.Link>
                        <Form className="my-2 my-lg-0 mx-auto d-sm-block"  >
                        </Form>
                        <Nav >
                            {props.loggedIn ? <LogoutButton logout={props.logout} user={props.user} loggedIn={props.loggedIn} /> :
                                <Button onClick={() => { navigate("/login"); }} variant="dark"> Login </Button>}
                        </Nav>

                    </Navbar>
                </Row>

                <Row className="below-nav" >
                    <Col md={2} >
                        <h1> Elenco dei corsi </h1>
                    </Col>
                    <Col md={10}  >
                        <CoursesListTable courses={props.courses} />
                    </Col>
                </Row>
                {/*<Row >
                <Col>
                    <Button variant="warning" size="lg" className="fixed-right-bottom">Crea piano degli studi</Button>
                </Col>
            </Row>*/}
            </Container>
        </>
    );

}
function CoursesListTable(props) {
    return (
        <Container fluid>
            <Row>
                <Table className='coltable'>
                    <thead>
                        <tr>
                            <th>Codice</th><th>Nome</th><th>Crediti</th><th>Numero iscritti</th><th>Max Studenti</th><th>Dettagli</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.courses.map((courses, i) =>
                            <CoursesRow courses={courses} key={i} />)}

                    </tbody>
                </Table>
            </Row>

        </Container>
    );
}

function CoursesRow(props) {

    //Vedi codice del prof per colorare riga della tabella di colore
    //rosso, verde e giallo per modifica aggiunta
    return (
        <>
            <tr>
                <CoursesData courses={props.courses} />
            </tr>
        </>
    );
}
function CoursesData(props) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <td> {props.courses.codice} </td>
            <td> {props.courses.nome} </td>
            <td> {props.courses.crediti} </td>
            <td> {props.courses.iscritti} </td>
            <td> {props.courses.maxstudenti} </td>
            <td> <Accordion className="accordion-text-width">
                <Accordion.Item eventKey="0">
                    <Accordion.Header >Espandi</Accordion.Header>
                    <Accordion.Body alwaysOpen >
                        <div>
                            <li>Incompatibilità : {props.courses.incompatibilità}</li>
                            <li>Propedeuticità : {props.courses.propedeuticità ? props.courses.propedeuticità : "-"}</li>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            </td >

            {/* <Button variant="info"
                onClick={() => setOpen(!open)}
                aria-controls="example-fade-text"
                aria-expanded={open}
            >
                Espandi
            </Button>
                <Accordion in={open} >
                    <div>
                        Incompatibilità : {props.courses.incompatibilità}
                        Propedeuticità : {props.courses.propedeuticità ? props.courses.propedeuticità : "-"}
                    </div>
    </Accordion> */}
        </>
    );
}

export { CoursesList, PlanPage };