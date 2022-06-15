import React, { useState } from 'react';
import { Form, Button, Container, Table, Row, Col, Stack } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function PlanComponents(props) {
    const navigate = useNavigate();
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
                if ((!(c.codice === undefined)) && (!(c.nome === undefined)) && (!(c.crediti === undefined)) && (props.time == 0 || props.time == 1)) {

                    if (props.time == 0 && (props.planCfu >= 20 && props.planCfu <= 40)) {
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
            props.addPlan(props.plan);
            /* Settare esistenza piano */
            //navigate(`/home-logged`);
        }
        else {

        }

    }



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
            <Button onClick={handleSubmit} variant="warning">Salva</Button>
        </Link>
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
{/* Aggiungere bottone elimina */ }
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