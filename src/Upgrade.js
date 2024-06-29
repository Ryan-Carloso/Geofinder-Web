import React from 'react';
import backgroundImage from './background.png';


const Upgrade = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
      <h2 style={{color: 'white'}} >Upgrade para Plano Pago</h2>
      <p style={{color: 'white'}} >Para utilizar a frequência de envio automatico de localização, você precisa de um plano pago.</p>
      <a href="https://pay.hotmart.com/F92384556N?off=sifqnek8" style={{ textDecoration: 'none' }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 700,
          }}
        >
          Upgrade
        </button>
      </a>
      </div>
    </div>
  );
};

export default Upgrade;
