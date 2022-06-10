import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function PlanComponents(props) {
    return (<>
        <h1>Ciao</h1>
        <Link to="/home-logged">
            <Button onClick={() => props.setOnAdd(false)}>Salva</Button>
        </Link>
    </>);
};


export { PlanComponents };