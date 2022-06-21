import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Table, Row, Col, Button, Navbar, Form, Nav, Accordion, Alert } from "react-bootstrap";
import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from './LoginComponents';
import { PlanComponents } from './PlanComponents';

function PlanPage(props) {

    return (
        <>
            <Container fluid  >
                <CoursesList courses={props.courses} loggedIn={props.loggedIn} logout={props.logout} user={props.user} enrolled={props.enrolled} planExists={props.planExists}
                    addCoursePlan={props.addCoursePlan} plan={props.planExists ? props.actualPlan : props.plan} setPlanExists={props.setPlanExists} time={props.time} onAdd={props.onAdd} />
                {
                    <> <Row className='below-nav'>
                        <Col md={2}> <h1>{props.planExists ? "Aggiorna il piano di studi" : "Crea un nuovo piano di studi"}</h1>
                            <Row><Col>
                                {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
                            </Col></Row>
                        </Col>
                        <Col md={10}>
                            {(props.onAdd || props.planExists > 0) ? <PlanComponents setOnAdd={props.setOnAdd} courses={props.courses} loggedIn={props.loggedIn} logout={props.doLogOut} actualPlan={props.actualPlan} deletePlan={props.deletePlan} setMessage={props.setMessage} setPlanCfu={props.setPlanCfu}
                                user={props.user} addCoursePlan={props.addCoursePlan} plan={props.planExists ? props.actualPlan : props.plan} setPlan={props.setPlan} setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} planCfu={props.planCfu} backupPlan={props.backupPlan} setActualPlan={props.setActualPlan}
                                time={props.time} deleteFromPlan={props.deleteFromPlan} decrementCfu={props.decrementCfu} addPlan={props.addPlan} planExists={props.planExists} updatePlan={props.updatePlan} /> : <CreatePlan setOnAdd={props.setOnAdd} setTime={props.setTime} planExists={props.planExists} />}
                        </Col>
                    </Row>
                    </>
                }
            </Container>

        </>)
}



function CreatePlan(props) {
    const [isSwitch1On, setIsSwitch1On] = useState(false);
    const [isSwitch2On, setIsSwitch2On] = useState(true); /* Full-Time selezionato di default */

    const onSwitch1Action = () => {
        setIsSwitch1On(!isSwitch1On);
        setIsSwitch2On(false);
    };
    const onSwitch2Action = () => {
        setIsSwitch2On(!isSwitch2On);
        setIsSwitch1On(false);
    };
    const handleSubmit = () => {
        props.setOnAdd(true);
        if (isSwitch1On)
            props.setTime(1) /* Part Time */
        else
            props.setTime(2) /* Full Time */
    }

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

                                type="checkbox"
                                id={`inline-1`}
                            />
                            <Form.Check onChange={onSwitch2Action}
                                inline
                                label="Full Time (60-80 cfu)"
                                name="group1"
                                type="checkbox"
                                checked={isSwitch2On}

                                id={`inline-2`}
                            /> </div> </Form>
                </Col>
                <Col >
                    <Button variant="warning" size="lg" className="fixed-right-bottom" onClick={handleSubmit} > Crea </Button>
                </Col>
            </Row>
        </>
    );
};

function CoursesList(props) {
    const navigate = useNavigate();
    return (
        <>
            <Container fluid>
                <Row>
                    <Navbar bg="warning" expand="sm" variant="dark" fixed="top" className="navbar-padding">

                        <Navbar.Brand >
                            <i className="bi bi-infinity" style={{ color: "black" }}></i>{""} Politecnico di Torino
                        </Navbar.Brand>
                        <Nav.Link href="/" style={{ color: "white" }} >Home</Nav.Link>
                        {props.loggedIn ? <Nav.Link href="/home-logged" style={{ color: "white" }} >Pagina Personale</Nav.Link> : ""}
                        <Form className="my-2 my-lg-0 mx-auto d-sm-block" >
                        </Form>
                        <Nav >
                            {props.loggedIn ? <LogoutButton logout={props.logout} user={props.user} loggedIn={props.loggedIn} /> :
                                <Button onClick={() => { navigate("/login"); }} variant="success"> Login </Button>}
                        </Nav>

                    </Navbar>
                </Row>

                <Row className="below-nav" >
                    <Col md={2} >
                        <h1> Elenco dei corsi </h1>
                    </Col>
                    <Col md={10}  >
                        <CoursesListTable courses={props.courses} addCoursePlan={props.addCoursePlan} plan={props.plan} enrolled={props.enrolled}
                            setPlanExists={props.setPlanExists} time={props.time} onAdd={props.onAdd} planExists={props.planExists} loggedIn={props.loggedIn} />
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
                            {(props.onAdd || props.planExists) ? <th>Aggiungi</th> : ""}<th>Codice</th><th>Nome</th><th>Crediti</th><th>Numero iscritti</th><th>Max Studenti</th><th>Dettagli</th><th>Errori</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.courses.map((courses, i) =>
                            <CoursesRow courses={courses} key={i} addCoursePlan={props.addCoursePlan} plan={props.plan} setPlanExists={props.setPlanExists}
                                planExists={props.planExists} time={props.time} onAdd={props.onAdd} enrolled={props.enrolled[i]} loggedIn={props.loggedIn} />)}
                    </tbody>
                </Table>
            </Row>

        </Container>
    );
}

function CoursesRow(props) {
    const [statusClass, setStatusClass] = useState('table-default');
    const [message, setMessage] = useState('');
    return (
        <>
            <tr className={statusClass}>
                <CoursesData courses={props.courses} addCoursePlan={props.addCoursePlan} time={props.time} enrolled={props.enrolled} planExists={props.planExists} loggedIn={props.loggedIn}
                    plan={props.plan} setPlanExists={props.setPlanExists} setStatusClass={setStatusClass} message={message} setMessage={setMessage} statusClass={statusClass} onAdd={props.onAdd} />
            </tr>
        </>
    );
}
function CoursesData(props) {
    const [isChecked, setIsChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);
    useEffect(() => {
        if (disabled && props.statusClass !== "table-success") {
            /* Si toglie il disabilitato dopo la useEffect e quando ci sono incompatibilità */
            /* Controllare le incompatibilità in seguito alla delete */
            if (props.courses.propedeuticità && props.plan.some((c) => checkProp(c.codice))) {
                setDisabled(false);
                setIsChecked(false);
                props.setStatusClass('table-default');
                props.setMessage('');
            }
            else if (!props.courses.propedeuticità && props.plan.every((c) => check(c.incompatibilità, c.codice))) {
                setDisabled(false);
                setIsChecked(false);
                props.setStatusClass('table-default');
                props.setMessage('');
            }

        }
        else if (props.statusClass === "table-success") {
            /* Se non è piuù presente nella lista */
            if (!props.plan.some((c) => c.codice === props.courses.codice)) {
                setDisabled(false);
                setIsChecked(false);
                props.setStatusClass('table-default');
            }
        }
        else if (props.statusClass === "table-danger") {

        }
    }, [props.plan.length, props.loggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

    const checkProp = (cod) => {
        if (props.courses.propedeuticità === cod) {
            return true;
        }
        return false;
    }
    const check = (inc, cod) => {
        if (inc.indexOf(props.courses.codice) !== -1) {
            dis();
            props.setStatusClass('table-danger');
            props.setMessage("Incompatibilità con: " + props.courses.incompatibilità);
            return false;
        }
        /* È presente già un esame con lo stesso codice nel piano */
        if (cod === props.courses.codice) {
            dis();
            props.setStatusClass('table-danger');
            props.setMessage("Corso già presente all'interno del piano");
            return false;
        }
        setDisabled(false);
        setIsChecked(false);
        props.setStatusClass('table-default');
        props.setMessage('');
        return true;
    };

    const dis = () => {
        setDisabled(true);
    }
    return (
        <>
            {(props.onAdd || (props.planExists > 0)) ? <td><SelectCheck plan={props.plan} addCoursePlan={props.addCoursePlan} courses={props.courses} enrolled={props.enrolled}
                setPlanExists={props.setPlanExists} time={props.time} check={check} isChecked={isChecked} checkProp={checkProp} planExists={props.planExists}
                setIsChecked={setIsChecked} disabled={disabled} setDisabled={setDisabled} dis={dis} setStatusClass={props.setStatusClass} setMessage={props.setMessage}
            /></td> : ""}
            <td> {props.courses.codice} </td>
            <td> {props.courses.nome} </td>
            <td> {props.courses.crediti} </td>
            <td> {props.enrolled} </td>
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
            <td>{props.message}</td>
        </>
    );
}

function SelectCheck(props) {
    const handleOnCheck = () => {
        if (!props.isChecked) {
            if (props.plan.length > 0) {
                if (props.plan.every((c) => props.check(c.incompatibilità, c.codice))) {
                    if (props.courses.maxstudenti && (props.enrolled > props.courses.maxstudenti)) {
                        props.dis();
                        props.setStatusClass('table-danger');
                        props.setMessage("Numero massimo iscritti superato");
                    }
                    else if (props.courses.propedeuticità) {
                        if (props.plan.some((c) => props.checkProp(c.codice))) {
                            props.dis();
                            props.addCoursePlan(props.courses, props.planExists);
                            props.setStatusClass('table-success');
                        }
                        else {
                            props.dis();
                            props.setStatusClass('table-danger');
                            props.setMessage("Inserire l'esame propedeutico: " + props.courses.propedeuticità);
                        }
                    }
                    else {
                        props.dis();
                        props.addCoursePlan(props.courses, props.planExists);
                        props.setStatusClass('table-success');
                    }
                }
            }
            else if (props.courses.propedeuticità) {
                props.setStatusClass('table-danger');
                props.setMessage("Inserire l'esame propedeutico: " + props.courses.propedeuticità);
            }
            else {
                //props.dis();
                props.addCoursePlan(props.courses, props.planExists);
                props.setStatusClass('table-success');
            }
        }
        props.setIsChecked(!props.isChecked);
    }
    return (<>
        <Form.Check variant="warning"
            type="checkbox"
            disabled={props.disabled}
            checked={props.isChecked}
            //label={`default ${type}`}
            onChange={handleOnCheck} />
    </>
    );
};

export { CoursesList, PlanPage };