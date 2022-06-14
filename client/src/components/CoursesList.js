import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Table, Row, Col, Button, Navbar, Form, Nav, Accordion } from "react-bootstrap";
import React from "react";
import { BsCollectionPlay } from "react-icons/bs";
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link, useLocation, Outlet } from 'react-router-dom';
import { LogoutButton } from './LoginComponents';

function PlanPage(props) {
    /* Sistemare la pagina nel caso il piano esiste già -> props.planExists */
    return (
        <>
            <Container fluid  >
                <CoursesList courses={props.courses} loggedIn={props.loggedIn} logout={props.logout} user={props.user}
                    addCoursePlan={props.addCoursePlan} plan={props.plan} setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} time={props.time} />
                {
                    props.planExists ? <StudyPlan /> : <> <Row className='below-nav'>
                        <Col md={2}> <h1>Crea un nuovo piano degli studi </h1> </Col>
                        <Col md={10} >
                            {props.onAdd ? <Outlet /> : <CreatePlan setOnAdd={props.setOnAdd} setTime={props.setTime} />}
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
    const location = useLocation();
    const onSwitch1Action = () => {
        setIsSwitch1On(!isSwitch1On);
    };
    const onSwitch2Action = () => {
        setIsSwitch2On(!isSwitch2On);
    };
    const handleSubmit = () => {
        props.setOnAdd(true);
        if (isSwitch1On)
            props.setTime(0)
        else
            props.setTime(1)
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
                        <Button variant="warning" size="lg" className="fixed-right-bottom" onClick={handleSubmit} > Crea </Button>
                    </Link> </Col>
            </Row>
        </>
    );
};
function StudyPlan(props) {
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
                                <Button onClick={() => { navigate("/login"); }} variant="success"> Login </Button>}
                        </Nav>

                    </Navbar>
                </Row>

                <Row className="below-nav" >
                    <Col md={2} >
                        <h1> Elenco dei corsi </h1>
                    </Col>
                    <Col md={10}  >
                        <CoursesListTable courses={props.courses} addCoursePlan={props.addCoursePlan} plan={props.plan}
                            setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} time={props.time} />
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
                            <th>Seleziona</th><th>Codice</th><th>Nome</th><th>Crediti</th><th>Numero iscritti</th><th>Max Studenti</th><th>Dettagli</th><th>Errori</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.courses.map((courses, i) =>
                            <CoursesRow courses={courses} key={i} addCoursePlan={props.addCoursePlan} plan={props.plan} setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} time={props.time} />)}
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
                <CoursesData courses={props.courses} addCoursePlan={props.addCoursePlan} time={props.time}
                    plan={props.plan} setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} setStatusClass={setStatusClass} message={message} setMessage={setMessage} />
            </tr>
        </>
    );
}
function CoursesData(props) {
    let cnt = 0;
    const [isChecked, setIsChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (disabled) {
            /* Si toglie il disabilitato dopo la useEffect e quando ci sono incompatibilità */
            /* Controllare le incompatibilità in seguito alla delete */
            if (props.courses.propedeuticità && props.plan.some((c) => checkProp(c.codice))) {
                setDisabled(false);
                setIsChecked(false);
                props.setStatusClass('table-default');
                props.setMessage('');
            }

        }
    }, [props.plan.length]);
    const checkProp = (cod) => {
        if (props.courses.propedeuticità == cod) {
            return true;
        }
        return false;
    }


    const check = (inc, cod) => {
        //console.log("Esame: " + props.courses.name);
        //console.log("Esame: " + props.courses.codice);
        /* Esame incompatibile, mostrare il messaggio */
        if (inc.indexOf(props.courses.codice) !== -1) {
            dis();
            props.setStatusClass('table-danger');
            props.setMessage("Incompatibilità con: " + props.courses.incompatibilità);
            return false;
        }
        /* È presente già un esame con lo stesso codice nel piano */
        if (cod == props.courses.codice) {
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
            <td> <SelectCheck plan={props.plan} addCoursePlan={props.addCoursePlan} courses={props.courses}
                setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} time={props.time} check={check} isChecked={isChecked} checkProp={checkProp}
                setIsChecked={setIsChecked} disabled={disabled} setDisabled={setDisabled} dis={dis} setStatusClass={props.setStatusClass} setMessage={props.setMessage}
            /></td>
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
            <td>{props.message}</td>

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

function SelectCheck(props) {
    const handleOnCheck = () => {
        let ok = false;
        /* Lo stato non è ancora aggiornato, quindi si prende il precedente (!isChecked) */
        /* Controllare incompatibilità  OK*/
        /* Controllare se esame propedeutico già presente 
            Nel caso non fare check/inserire, segnalare l'errore ma non disabilitare
        */
        /* Controllare num massimo studenti iscritti ed aggiornare il numero in tempo reale */
        /* Controllare che l'esame non sia già presente */
        if (!props.isChecked) {
            console.log("Codice" + props.courses.codice);
            //console.log("Codice" + props.courses.incompatibilità);
            console.log(props.courses)
            if (props.plan.length > 0) {
                if (props.plan.every((c) => props.check(c.incompatibilità, c.codice))) {
                    if (props.courses.propedeuticità) {
                        if (props.plan.some((c) => props.checkProp(c.codice))) {
                            props.addCoursePlan(props.courses);
                            props.incrementCfu(props.courses.crediti);
                            props.setStatusClass('table-success');
                        }
                        else {
                            props.dis();
                            props.setStatusClass('table-danger');
                            props.setMessage("Inserire l'esame propedeutico: " + props.courses.propedeuticità);
                        }
                    }
                    else {
                        props.addCoursePlan(props.courses);
                        props.incrementCfu(props.courses.crediti);
                        props.setStatusClass('table-success');
                    }
                }
            }
            else if (props.courses.propedeuticità) {
                props.setStatusClass('table-danger');
                props.setMessage("Inserire l'esame propedeutico: " + props.courses.propedeuticità);
                props.dis();
            }
            else {
                props.addCoursePlan(props.courses);
                props.incrementCfu(props.courses.crediti);
                props.setStatusClass('table-success');
            }
        }
        props.setIsChecked(!props.isChecked);
    }




    //console.log(props.plan);


    //console.log(props.plan)
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