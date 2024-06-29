import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css'; // Import custom CSS for styling

// Define icon to fix the default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Finder = () => {
  const [code, setCode] = useState('');
  const [foundLocation, setFoundLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setErrorMessage('Ocorreu um erro ao obter sua localização.');
        }
      );
    } else {
      setErrorMessage('Geolocalização não suportada pelo seu navegador.');
    }
  }, []);

  const handleFindLocation = async (event) => {
    event.preventDefault();

    try {
      const url = `https://geo-finder-7e641-default-rtdb.europe-west1.firebasedatabase.app/codes/${code}.json`;
      const response = await axios.get(url);

      if (response.data && response.data.latitude && response.data.longitude) {
        const { latitude, longitude } = response.data;
        setFoundLocation({ latitude, longitude });
        setErrorMessage('');
      } else {
        setFoundLocation(null);
        setErrorMessage('Código não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar código no Firebase:', error);
      setErrorMessage('Ocorreu um erro ao buscar o código. Por favor, tente novamente.');
    }
  };

  const MapButtons = ({ onGoToCurrentLocation, onGoToFoundLocation }) => {
    return (
      <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <button
          onClick={onGoToCurrentLocation}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: 'blue', color: 'white' }}
        >
          Minha Localização
        </button>
        <button
          onClick={onGoToFoundLocation}
          style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}
        >
          Localização Encontrada
        </button>
        <Link to="/" style={{ padding: '10px', backgroundColor: 'white', color: 'black', fontWeight: 700, marginLeft: 10, display: 'inline-block', textDecoration: 'none' }}>
          Voltar
        </Link>
      </div>
    );
  };

  const MapComponent = () => {
    const map = useMap();

    const goToCurrentLocation = () => {
      if (currentLocation) {
        map.setView([currentLocation.latitude, currentLocation.longitude], 13);
      }
    };

    const goToFoundLocation = () => {
      if (foundLocation) {
        map.setView([foundLocation.latitude, foundLocation.longitude], 13);
      }
    };

    return <MapButtons onGoToCurrentLocation={goToCurrentLocation} onGoToFoundLocation={goToFoundLocation} />;
  };

  return (
    <div className="app">
      <form onSubmit={handleFindLocation} className="form">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Insira o Código"
          required
        />
        <button type="submit">Buscar Localização</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {currentLocation && (
        <MapContainer
          center={[currentLocation.latitude, currentLocation.longitude]}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
            <Popup>Sua Localização Atual</Popup>
          </Marker>
          {foundLocation && (
            <Marker position={[foundLocation.latitude, foundLocation.longitude]}>
              <Popup >Localização Encontrada</Popup>
            </Marker>
          )}
          <MapComponent />
        </MapContainer>
      )}
    </div>
  );
};

export default Finder;
