import React from 'react';
import { Form } from 'react-bootstrap';

function SelectCheck(props) {
    const handleOnCheck = () => {
        if (!props.isChecked) {
            if (props.plan.length > 0) {
                if (props.plan.every((c) => props.check(c.incompatibilità, c.codice))) {
                    if (props.courses.maxstudenti && (props.enrolled > props.courses.maxstudenti)) {
                        props.dis();
                        props.setStatusClass('table-danger');
                        props.setMessageErr("Numero massimo iscritti superato");
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
                            props.setMessageErr("Inserire l'esame propedeutico: " + props.courses.propedeuticità);
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
                props.setMessageErr("Inserire l'esame propedeutico: " + props.courses.propedeuticità);
            }
            else {
                props.dis();
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
            onChange={handleOnCheck} />
    </>
    );
};

export { SelectCheck };