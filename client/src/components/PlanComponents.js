import React, { useState } from 'react';
import { Form, Button, Container, Table, Row, Col, Stack } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
function PlanComponents(props) {
    return (<>
        <Row><h2>Elenco degli esami</h2></Row>
        <Row ><PlanNumberStudents /></Row>
        <Row><PlanTable courses={props.courses} /></Row>
        <Link to="/home-logged">
            <Button onClick={() => props.setOnAdd(false)} variant="warning">Salva</Button>
        </Link>
    </>);
};

function PlanTable(props) {
    return (
        <Container fluid>
            <Row>
                <Table className='coltable'>
                    <thead>
                        <tr>
                            <th>Seleziona</th> <th>Codice</th><th>Nome</th><th>Crediti</th><th>Numero iscritti</th><th>Max Studenti</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.courses.map((courses, i) =>
                            <TableRow courses={courses} key={i} />)}
                    </tbody>
                </Table>
            </Row>

        </Container>
    );
};

function TableRow(props) {
    return (
        <>
            <tr>
                <TableData courses={props.courses} />
            </tr>
        </>
    );
};

function TableData(props) {
    return (
        <>
            <td>
                <Form.Check variant="warning"
                    type="checkbox"
                //id={`default-${}`}
                //label={`default ${type}`}
                />
            </td>
            <td> {props.courses.codice} </td>
            <td> {props.courses.nome} </td>
            <td> {props.courses.crediti} </td>
            <td> {props.courses.iscritti} </td>
            <td> {props.courses.maxstudenti} </td>
        </>
    );
};
function PlanNumberStudents(props) {
    const divStyle = {
        color: 'black',
        border: "2px solid orange"
    };
    return (
        <>
            <Stack direction="horizontal" gap={5}>
                <div style={divStyle}>Cfu</div>
                <Cfu />
                <div style={divStyle}>Min Cfu</div>
                <CfuMin />
                <div style={divStyle}>Max Cfu</div>
                <CfuMax />
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
        <div style={divStyle} md>
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
        <div style={divStyle} md>
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
        <div style={divStyle} md>
            1
        </div>
    );
};
function PlanCheck(props) {
    return (<>

    </>
    );
};
export { PlanComponents };

