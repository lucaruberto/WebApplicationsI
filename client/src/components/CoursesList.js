import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Table, Row, Col, Button, Navbar, Form, FormControl, NavDropdown, Nav, Fade, Collapse, Accordion } from "react-bootstrap";
import React from "react";
import { BsCollectionPlay } from "react-icons/bs";
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link, useLocation, Outlet } from 'react-router-dom';
import { LogoutButton } from './LoginComponents';

function PlanPage(props) {
    console.log(props.onAdd);
    const location = useLocation();
    /* Sistemare la pagina nel caso il piano esiste già -> props.planExists */
    return (
        <>
            <Container fluid  >
                <CoursesList courses={props.courses} loggedIn={props.loggedIn} logout={props.logout} user={props.user} />
                {props.planExists ? <PlanTable /> : <> <Row className='below-nav'>
                    <Col md={2}> <h1>Crea un nuovo piano degli studi </h1> </Col>
                    <Col md={10} className="below-nav">
                        {props.onAdd ? <Outlet /> : <CreatePlan setOnAdd={props.setOnAdd} />}
                    </Col>
                </Row>
                </>}
                <Row className="below-nav">

                </Row>

            </Container>

        </>)
}
function CreatePlan(props) {
    const [isSwitch1On, setIsSwitch1On] = useState(false);
    const [isSwitch2On, setIsSwitch2On] = useState(true);
    const location = useLocation();
    const onSwitch1Action = (event) => {
        setIsSwitch1On(!isSwitch1On);
    };
    const onSwitch2Action = (event) => {
        setIsSwitch2On(!isSwitch2On);
    };
    return (
        <>
            <Row><h5>Scegli la tipologia di piano</h5></Row>
            <Row>
                <Col >
                    <Form>
                        <div className="mb-3" >
                            <Form.Check onChange={onSwitch1Action}
                                inline
                                label="Part Time (40-60 cfu)"
                                name="group1"
                                checked={isSwitch1On}
                                disabled={isSwitch2On}
                                type="checkbox"
                                id={`inline-1`}
                            />
                            <Form.Check onChange={onSwitch2Action}
                                inline
                                label="Full Time (60-80 cfu)"
                                name="group1"
                                type="checkbox"
                                checked={isSwitch2On}
                                disabled={isSwitch1On}
                                id={`inline-2`}
                            /> </div> </Form>
                </Col>
                <Col >
                    <Link to="add" state={{ nextpage: location.pathname }} >
                        <Button variant="primary" size="lg" className="fixed-right-bottom" onClick={() => props.setOnAdd(true)} > Crea </Button>
                    </Link> </Col>
            </Row>
        </>
    );
};
function PlanTable(props) {
    return (false);
};

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
                    <Accordion.Body  >
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
function PlanOption(props) {

    <Row><Button>Full Time</Button>
        <Button>Part Time</Button>
    </Row>
}
export { CoursesList, PlanPage };