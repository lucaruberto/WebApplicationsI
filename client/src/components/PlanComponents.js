import React from 'react';
import { Button, Container, Table, Row, Col, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PlanComponents(props) {
    const handleSubmit = (event) => {
        let ok = false;
        event.preventDefault();
        //ADD

        /* Lunghezza = 0 scarta */
        /* Controllo con i cfu min e max */
        /* Controllo lunghezza codice 7 caratteri */
        /* Controllo nome, crediti, codici esistono */
        if (props.plan.length > 0) {
            for (let c of props.plan) {
                if ((!(c.codice === undefined)) && (!(c.nome === undefined)) && (!(c.crediti === undefined)) && (props.time === 1 || props.time === 2)) {

                    if (props.time === 1 && (props.planCfu >= 20 && props.planCfu <= 40)) {
                        /* Part Time */
                        ok = true;
                    }
                    else if (props.planCfu >= 60 && props.planCfu <= 80) {
                        ok = true;
                    }
                }
            }
        }
        if (ok) {
            props.addPlan(props.plan, props.time);
            props.setOnAdd(false);
            /* Settare esistenza piano */
            //navigate(`/home-logged`);
        }
        else {
            console.log("Errore");
        }
    }



    return (<>
        <Col md={10} >
            <h1> {props.planExists ? ("Piano degli studi di: " + props.user?.name) : "Nuovo Piano degli studi"} {""}
                {props.planExists ? (props.planExists === 1 ? "(Part Time)" : "(Full Time)") : props.time === 0 ? "(Part Time)" : "(Full Time)"}</h1>

        </Col>
        <Col md={10}  >
            <PlanNumberStudents planCfu={props.planCfu} time={props.time} planExists={props.planExists} />
            <Container fluid>
                <Row>
                    <Table className='coltable'>
                        <thead>
                            <tr>
                                <th>Elimina</th><th>Codice</th><th>Nome</th><th>Crediti</th><th>Numero iscritti</th><th>Max Studenti</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.planExists ? props.actualPlan.map((plan, i) =>
                                <PlanRow plan={plan} key={i} deleteFromPlan={props.deleteFromPlan} decrementCfu={props.decrementCfu} />) :
                                props.plan.map((plan, i) =>
                                    <PlanRow plan={plan} key={i} deleteFromPlan={props.deleteFromPlan} decrementCfu={props.decrementCfu} />)}
                        </tbody>
                    </Table>
                </Row>
            </Container>
            {!props.planExists ? <Row>

                <Col xs={1}>
                    <Link to="/home-logged">
                        <Button onClick={handleSubmit} variant="success">Salva</Button>
                    </Link>
                </Col>
                <Col xs={1}>
                    <Link to="/home-logged">
                        <Button onClick={() => { props.setPlan([]); props.setOnAdd(false) }} variant="danger">Annulla</Button>
                    </Link>
                </Col></Row> : <Row><Col xs={1}>
                    <Link to="/home-logged">
                        <Button onClick={handleSubmit} variant="success">Salva</Button>
                    </Link>
                </Col>
                <Col xs={1}>
                    <Link to="/home-logged">
                        <Button onClick={() => { props.setPlan([]); props.setOnAdd(false) }} variant="warning">Annulla</Button>
                    </Link>
                </Col>
                <Col xs={1}>
                    <Link to="/home-logged">
                        <Button onClick={() => { props.setPlan([]); props.setOnAdd(false); props.deletePlan() }} variant="danger">Elimina</Button>
                    </Link>
                </Col></Row>

            }
        </Col>
    </>);
    /*  <Button onClick={() => props.setOnAdd(false) } variant="warning">Salva</Button> */
};

function PlanRow(props) {
    return (
        <>
            <tr>
                <PlanData plan={props.plan} deleteFromPlan={props.deleteFromPlan} decrementCfu={props.decrementCfu} />
            </tr>
        </>
    );
};
function PlanData(props) {
    /* Implementare la funzione per la delete di un corso se non ci sono vincoli di propedeuticità da rispettare */
    /* onClick={() => { props.deleteFilm(props.id) }} */
    return (
        <>
            <td>
                <i className="bi bi-x-circle-fill" style={{ color: "red" }} onClick={() => { props.deleteFromPlan(props.plan) }}></i>
            </td>
            <td> {props.plan.codice} </td>
            <td> {props.plan.nome} </td>
            <td> {props.plan.crediti} </td>
            <td> {props.plan.iscritti} </td>
            <td> {props.plan.maxstudenti} </td>
        </>
    );
};
function PlanNumberStudents(props) {
    let cfuMin;
    let cfuMax;
    const divStyle = {
        color: 'black',
        border: "2px solid orange"
    };
    if (props.time === 1 || props.planExists === 1) {
        cfuMin = 20; cfuMax = 40;
    }
    else if (props.time === 2 || props.planExists === 2) {
        cfuMin = 60; cfuMax = 80;
    }

    return (
        <>
            <Stack direction="horizontal" gap={5}>
                <div>Cfu Attuali</div>
                <div>{props.planCfu}</div>
                <div>Min Cfu</div>
                <div>{cfuMin}</div>
                <div>Max Cfu</div>
                <div>{cfuMax}</div>
            </Stack>
        </>);
};
/* Actual Cfu */
function Cfu(props) {
    const divStyle = {
        color: 'black',
        border: "2px solid black"
    };
    return (
        <div >
            1
        </div>
    );
};

export { PlanComponents };