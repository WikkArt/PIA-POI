import React from "react";
import { Link } from 'react-router-dom';

const ChooseSection = () => {

    return (
        <div class="choosesection">
            <div className="container">
            <span>¿Qué desea hacer?</span>
            <div><Link to="/chatgroup">Chatear de manera grupal</Link></div>
            <div><Link to="/">Chatear de manera privada</Link></div>
            </div>
        </div> 
    )
}

export default ChooseSection