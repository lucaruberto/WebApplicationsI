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
        if (ok && !props.planExists) {
            props.addPlan(props.plan, props.time);

            /* Settare esistenza piano */
            //navigate(`/home-logged`);
        }
        else if (ok && props.planExists) {
            props.updatePlan(props.plan);
        }
        else {
            props.setMessage("Non è possibile inserire o aggiornare il piano in quanto non rispetta i parametri")
        }
    }
    const handleDelete = (codice) => {
        if (props.plan.some((c) => c.propedeuticità === codice)) {
            props.setMessage("Non è possibile eliminare il corso in quanto propedeutico");
        }
        else
            props.deleteFromPlan(props.plan);


    }


    return (<>
        <Col md={10} >
            <h1> {props.planExists ? ("Piano di studi di: " + props.user?.name) : "Nuovo Piano degli studi"} {""}
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
                            {
                                props.plan.map((plan, i) =>
                                    <PlanRow plan={plan} key={i} deleteFromPlan={props.deleteFromPlan} decrementCfu={props.decrementCfu} courses={props.courses} handleDelete={handleDelete} />)}
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
                </Col></Row>
                :
                <Row><Col xs={1}>
                    <Link to="/home-logged">
                        <Button onClick={() => props.updatePlan(props.plan)} variant="success">Salva</Button>
                    </Link>
                </Col>
                    <Col xs={1}>
                        <Link to="/home-logged">
                            <Button onClick={() => props.setActualPlan(props.backupPlan)} variant="warning">Annulla</Button>
                        </Link>
                    </Col>
                    <Col xs={1}>
                        <Link to="/home-logged">
                            <Button onClick={() => { props.setActualPlan([]); props.setOnAdd(false); props.deletePlan(); }} variant="danger">Elimina</Button>
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
                <PlanData plan={props.plan} deleteFromPlan={props.deleteFromPlan} decrementCfu={props.decrementCfu} courses={props.courses} handleDelete={props.handleDelete} />
            </tr>
        </>
    );
};
function PlanData(props) {
    return (
        <>
            <td>
                <i className="bi bi-x-circle-fill" style={{ color: "red" }} onClick={() => { props.handleDelete(props.plan.codice) }}></i>
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
    if (props.time === 1 || props.planExists === 1) {
        cfuMin = 20; cfuMax = 40;
    }
    else if (props.time === 2 || props.planExists === 2) {
        cfuMin = 60; cfuMax = 80;
    }

    return (
        <>
            <Stack direction="horizontal" gap={5}>
                <div>Cfu Totali</div>
                <div>{props.planCfu}</div>
                <div>Min Cfu</div>
                <div>{cfuMin}</div>
                <div>Max Cfu</div>
                <div>{cfuMax}</div>
            </Stack>
        </>);
};


export { PlanComponents };