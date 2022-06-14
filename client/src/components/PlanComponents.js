import React, { useState } from 'react';
import { Form, Button, Container, Table, Row, Col, Stack } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function PlanComponents(props) {
    return (<>
        <Row>
            <h2>Piano degli studi attuale</h2>
        </Row>
        <Row ><PlanNumberStudents planCfu={props.planCfu} time={props.time} /></Row>
        <Container fluid>
            <Row>
                <Table className='coltable'>
                    <thead>
                        <tr>
                            <th>Elimina</th><th>Codice</th><th>Nome</th><th>Crediti</th><th>Numero iscritti</th><th>Max Studenti</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.plan.map((plan, i) =>
                            <PlanRow plan={plan} key={i} deleteFromPlan={props.deleteFromPlan} decrementCfu={props.decrementCfu} />)}
                    </tbody>
                </Table>
            </Row>
        </Container>
        <Link to="/home-logged">
            <Button onClick={() => props.setOnAdd(false)} variant="warning">Salva</Button>
        </Link>
    </>);
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
{/* Aggiungere bottone elimina */ }
function PlanData(props) {
    /* Implementare la funzione per la delete di un corso se non ci sono vincoli di propedeuticità da rispettare */
    /* onClick={() => { props.deleteFilm(props.id) }} */
    return (
        <>
            <td>
                <i className="bi bi-x-circle-fill" style={{ color: "red" }} onClick={() => { props.deleteFromPlan(props.plan.codice); props.decrementCfu(props.plan.crediti); }}></i>
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
    if (props.time == 0) {
        cfuMin = 20; cfuMax = 40;
    }
    else if (props.time == 1) {
        cfuMin = 60; cfuMax = 80;
    }

    return (
        <>
            <Stack direction="horizontal" gap={5}>
                <div >Cfu Attuali</div>
                <div>{props.planCfu}</div>
                <div >Min Cfu</div>
                <div>{cfuMin}</div>
                <div >Max Cfu</div>
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
/* Min Cfu depends on Plan Full/Part Time */
function CfuMin(props) {
    const divStyle = {
        color: 'black',
        border: "2px solid black"
    };
    return (
        <div  >
            1
        </div>
    );
};
/* Max Cfu depends on Plan Full/Part Time */
function CfuMax(props) {
    const divStyle = {
        color: 'black',
        border: "2px solid black"
    };
    return (
        <div  >
            1
        </div>
    );
};
export { PlanComponents };