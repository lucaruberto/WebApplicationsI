import React, { useState } from 'react';
import { Form, Button, Container, Table, Row, Col, Stack } from 'react-bootstrap';
import { BsInboxesFill } from 'react-icons/bs';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PlanComponents } from './PlanComponents'


function SelectComponents(props) {
    /*  <Row><h2>Elenco dei corsi</h2></Row>
         <Row><SelectTable courses={props.courses} addCoursePlan={props.addCoursePlan} plan={props.plan} setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} /></Row>
         <Row></Row> */
    return (<>
        <Row>
            <h2>Piano degli studi attuale</h2>
        </Row>
        <Row> <PlanComponents courses={props.courses} setOnAdd={props.setOnAdd} plan={props.plan} planCfu={props.planCfu} time={props.time} />   </Row>
    </>);
};

function SelectTable(props) {
    return (
        <Container fluid>
            <Row>
                <Table className='coltable'>
                    <thead>
                        <tr>
                            <th>Seleziona</th><th>Codice</th><th>Nome</th><th>Crediti</th><th>Numero iscritti</th><th>Max Studenti</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.courses.map((courses, i) =>
                            <SelectRow courses={courses} key={i} addCoursePlan={props.addCoursePlan} plan={props.plan} setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} />)}
                    </tbody>
                </Table>
            </Row>

        </Container>
    );
};

function SelectRow(props) {
    return (
        <>
            <tr>
                <SelectData courses={props.courses} addCoursePlan={props.addCoursePlan} plan={props.plan} setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} />
            </tr>
        </>
    );
};

function SelectData(props) {
    return (
        <>
            <td>
                <SelectCheck plan={props.plan} addCoursePlan={props.addCoursePlan} courses={props.courses} setPlanExists={props.setPlanExists} incrementCfu={props.incrementCfu} />
            </td>
            <td> {props.courses.codice} </td>
            <td> {props.courses.nome} </td>
            <td> {props.courses.crediti} </td>
            <td> {props.courses.iscritti} </td>
            <td> {props.courses.maxstudenti} </td>
        </>
    );
};

/* Selection of one cours to insert in the Plan */
function SelectCheck(props) {
    const [isChecked, setIsChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);
    /* Funzione per disabilitare il check */
    /* Dovrebbe esserci anche una useEffect per colorare in modo diverso la riga */
    /* Si possono spostare i due stati a livello superiore insieme ad una funzione che esegue il cambiamento */
    const dis = () => {
        setDisabled(true);
    }
    const checkInc = (inc) => {
        console.log("Inc:" + inc);
        if (inc.indexOf(props.courses.codice) == -1)
            return true;
        else {
            dis();
            return false; /* Si deve segnare il codice incompatibile 
                              Mostrare a video l'errore, l'esame con cui è incompatibile,
                              disabilitare il check      */
        }

    };
    const handleOnCheck = () => {
        /* Lo stato non è ancora aggiornato, quindi si prende il precedente (!isChecked) */
        /* Controllare incompatibilità */
        /* Controllare se esame propedeutico già presente 
            Nel caso non fare check/inserire, segnalare l'errore ma non disabilitare
        */
        /* Controllare num massimo studenti iscritti ed aggiornare il numero in tempo reale */
        if (!isChecked) {
            /* console.log("Codice" + props.courses.codice);
            console.log("Codice" + props.courses.incompatibilità);
            console.log(props.courses) */
            if (
                props.plan.every((c) => checkInc(c.incompatibilità))) {
                props.addCoursePlan(props.courses);
                props.incrementCfu(props.courses.crediti);
            }
        }
        //console.log(props.plan);
        setIsChecked(!isChecked);
    }
    //console.log(props.plan)
    return (<>
        <Form.Check variant="warning"
            type="checkbox"
            disabled={disabled}
            checked={isChecked}
            //label={`default ${type}`}
            onChange={handleOnCheck} />
    </>
    );
};
export { SelectComponents };

