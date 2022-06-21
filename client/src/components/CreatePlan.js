import { Row, Col, Button, Form } from "react-bootstrap";
import React from "react";
import { useState } from 'react';

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

export { CreatePlan };