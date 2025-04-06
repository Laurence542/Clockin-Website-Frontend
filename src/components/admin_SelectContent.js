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


import * as React from 'react';

export default function LogoComponent() {
  return (
    <div>
      {/* Logo Container */}
      <div 
        style={{ 
          textAlign: 'center', 
          borderRadius: '5px',
          display: 'inline-block'
        }}
      >
        <a href="/overview" rel="noopener noreferrer">
          <img 
            src="segritude.png" 
            alt="Logo" 
            style={{ width: '200px', height: '50px', cursor: 'pointer' }} 
          />
        </a>
      </div>
    </div>
  );
}
