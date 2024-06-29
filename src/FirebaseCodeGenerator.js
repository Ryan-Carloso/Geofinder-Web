import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from './background.png';
import Footer from './footer';

const FirebaseCodeGenerator = () => {
  const [code, setCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [hasPaidPlan, setHasPaidPlan] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const intervalTimeRef = useRef(24 * 60 * 60 * 1000);

  useEffect(() => {
    const savedCode = localStorage.getItem('generatedCode');
    if (savedCode) {
      setCode(savedCode);
      setButtonDisabled(true);
    }

    const interval = setInterval(() => {
      if (code) {
        sendLocationToFirebase(code);
      }
    }, intervalTimeRef.current);

    return () => clearInterval(interval);
  }, [code]);

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    const length = 10;
    let generatedCode = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedCode += characters[randomIndex];
    }

    return generatedCode;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let generatedCode = code;
      if (!generatedCode) {
        generatedCode = generateRandomCode();
        setCode(generatedCode);
        localStorage.setItem('generatedCode', generatedCode);
        setButtonDisabled(true);
      }

      await sendLocationToFirebase(generatedCode);
      setSuccessMessage('Código enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar código para o Firebase:', error);
      setErrorMessage('Ocorreu um erro ao enviar o código. Por favor, tente novamente.');
    }
  };

  const sendLocationToFirebase = async (currentCode) => {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const data = {
            code: currentCode,
            latitude: latitude,
            longitude: longitude
          };

          const url = `https://geo-finder-7e641-default-rtdb.europe-west1.firebasedatabase.app/codes/${currentCode}.json`;

          await axios.put(url, data);

          console.log('Localização enviada para o Firebase:', data);
        }, (error) => {
          console.error('Erro ao obter localização:', error);
        });
      } else {
        console.log('Geolocalização não suportada pelo seu navegador.');
      }
    } catch (error) {
      console.error('Erro ao enviar localização para o Firebase:', error);
    }
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setSuccessMessage('Código copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar código:', error);
      setErrorMessage('Ocorreu um erro ao copiar o código. Por favor, tente novamente.');
    }
  };

  const handleDeleteCode = () => {
    localStorage.removeItem('generatedCode');
    setCode('');
    setButtonDisabled(false);
    setSuccessMessage('Código deletado com sucesso!');
  };

  const handleFrequencyChange = (selectedFrequency) => {
    if (!hasPaidPlan) {
      setShowPopup(true);
    } else {
      switch (selectedFrequency) {
        case '30min':
          intervalTimeRef.current = 30 * 60 * 1000;
          break;
        case '6hours':
          intervalTimeRef.current = 6 * 60 * 60 * 1000;
          break;
        default:
          intervalTimeRef.current = 24 * 60 * 60 * 1000;
          break;
      }
      setSuccessMessage(`Frequência de envio ajustada para ${selectedFrequency === '30min' ? '30 minutos' : '6 horas'}.`);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleUpgradeClick = () => {
    navigate('/upgrade');
  };

  return (
    <div style={{ textAlign: 'center' }}>
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

        <h2 style={{ color: 'white', fontSize: '2em', marginBottom: '20px' }}>Gerador de Código</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '100%', width: '300px' }}>

          <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontSize: '1.2em' }}>
            Código Gerado:
            <br/>
            <input
              id="generatedCodeInput"
              type="text"
              value={code}
              readOnly
              style={{ marginLeft: '10px', borderRadius: '5px', padding: '5px', fontSize: '1em', width: '50%', margin: 'auto' }}
            />
          </label>
          {buttonDisabled ? (
            <>
            <view style={{display: 'flex', flexDirection: 'column', width: 100, margin: 'auto'}} >
              <button type="button" onClick={handleCopyClick} style={{ fontSize: '1em', padding: '5px 10px', marginBottom: '10px', borderRadius: 10, }}>Copiar Código</button>
              <button type="button" onClick={handleDeleteCode} style={{ fontSize: '1em', padding: '5px 10px', marginBottom: '10px', borderRadius: 10, }}>Deletar Código</button>
              </view>
              <h3 style={{ color: 'white' }}>Escolha os tempos que a localização vai ser enviada!</h3>
              <div style={{ marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => handleFrequencyChange('30min')} 
                  style={{ marginRight: '10px', padding: '5px 10px', marginBottom: '10px', borderRadius: 10, }}
                >
                  30 min
                </button>
                <button 
                  type="button" 
                  onClick={() => handleFrequencyChange('6hours')}
                  style={{ marginRight: '10px', padding: '5px 10px', marginBottom: '10px', borderRadius: 10, }}

                >
                  6 horas
                </button>
              </div>
            </>
          ) : (
            <button type="submit" style={{ fontSize: '1em', padding: '10px 20px', marginBottom: '10px' }}>Gerar e Enviar para o Firebase</button>
          )}
        </form>
        {successMessage && <p style={{ color: 'white', fontWeight: 700, fontSize: '1em', marginTop: '10px' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red', fontSize: '1em', marginTop: '10px' }}>{errorMessage}</p>}
        <Link
          to="/finder"
          style={{
            padding: '10px',
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 700,
            display: 'inline-block',
            textDecoration: 'none',
            marginTop: '10px',
            fontSize: '1em',
          }}
        >
          Ir para Finder
        </Link>
        <Footer/>
      </div>

      {showPopup && (
        <div 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.25)',
            zIndex: 1000,
          }}
        >
          <h3>Este é um recurso pago</h3>
          <p>Para usar a frequência de 30 minutos ou 6 horas, você precisa de um plano pago, a pesquisa manual é gratuita.</p>
          <button onClick={handleUpgradeClick} style={{ marginRight: '10px' }}>Upgrade</button>
          <button onClick={handlePopupClose}>Fechar</button>
        </div>
      )}

    </div>
  );
};

export default FirebaseCodeGenerator;
