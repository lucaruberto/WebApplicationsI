import React from "react";
import { Link } from "react-router-dom";
import { FcHighPriority } from "react-icons/fc"
function NoMatch() {
    return (
        <>
            <h1>
                <p align="center" > Oops! <FcHighPriority /> </p>
                <p align="center">We can't seem to find the page you are looking for. </p>
            </h1>
            <h5 align="center" size="1">Here are some helpful link instead
                <ul></ul>
                <Link to="/">Home</Link>
                <ul></ul>

            </h5>

        </>
    );
};

export { NoMatch };