import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Table, Row, Col, Button, Navbar, Form, FormControl, NavDropdown, Nav } from "react-bootstrap";
import React from "react";
import { BsCollectionPlay } from "react-icons/bs";
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CoursesList(props) {
    //const navigate = useNavigate();

    return (
        <>

            <Row>
                <Navbar bg="warning" expand="sm" variant="dark" fixed="top" className="navbar-padding">

                    <Navbar.Brand >
                        <BsCollectionPlay />{" "} Politecnico di Torino
                    </Navbar.Brand>
                    <Nav.Link href="/" style={{ color: "white" }} >Home</Nav.Link>
                    <Form className="my-2 my-lg-0 mx-auto d-sm-block"  >

                    </Form>
                    <Nav className="ml-md-auto">
                        <Nav.Item>
                            <Nav.Link href="#">
                                <i className="bi bi-person-circle icon-size" />
                            </Nav.Link>
                        </Nav.Item>

                    </Nav>

                </Navbar>
            </Row>
            <ul></ul>

            <Row >
                <Col md={2} className="below-nav">
                    Piano degli studi
                </Col>
                <Col md={10} className="below-nav" >
                    <CoursesListTable courses={props.courses} />
                </Col>
            </Row>
            <Row >
                <Col>
                    <Button variant="warning" size="lg" className="fixed-right-bottom">Crea piano degli studi</Button>
                </Col>
            </Row>


        </>
    );

}
function CoursesListTable(props) {
    return (
        <Container fluid>
            <Row>
                <Table>
                    <thead>
                        <tr>
                            <th>Codice</th><th>Nome</th><th>Crediti</th><th>Max Studenti</th><th>Incompatibilità</th><th>Propedeuticità</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.courses.map((courses, i) =>
                                <CoursesRow courses={courses} key={i} />)
                        }
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
        <tr>
            <CoursesData courses={props.courses} />
        </tr>
    );
}
function CoursesData(props) {

    const navigate = useNavigate();

    return (
        <>
            <td> {props.courses.codice} </td>
            <td> {props.courses.nome} </td>
            <td> {props.courses.crediti} </td>
            <td> {props.courses.maxstudenti} </td>
            <td> {props.courses.incompatibilità} </td>
            <td> {props.courses.propedeuticità} </td>
        </>
    );
}

export { CoursesList, CoursesData, CoursesRow };