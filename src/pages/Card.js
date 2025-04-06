/*
 ------------------------------------------------------------------------------
 ------------------------------------------------------------------------------
 Copyright @ 2024 Segritude LTD.
 All right reserved.
 This code and all related assets are the property of segritude LTD.
 Unauthorized copying, distribution, or modification of this file, 
 via any medium, is strictly prohibited.

 NOTE: Tampering with or removing this notice is prohibited. 
 Any attempt to circumvent this restriction will be subject to legal action.

 ------------------------------------------------------------------------------
 ------------------------------------------------------------------------------
*/ 


import React from 'react';
import '../styles/Card.css';

function Card({ title, value, change, timeframe }) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p className="card-value">{value}</p>
        </div>
    );
}

export default Card;
