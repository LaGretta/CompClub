import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const C = { yellow: '#facc15', bg: '#09090b', surface: '#121214' };

const CLUBS = [
  { id: 1, name: 'Київ', lat: 50.4501, lng: 30.5234, status: 'ON' },
  { id: 2, name: 'Львів', lat: 49.8397, lng: 24.0297, status: 'OFF' },
  { id: 3, name: 'Тернопіль', lat: 49.5535, lng: 25.5948, status: 'ON' },
  { id: 4, name: 'Дніпро', lat: 48.4647, lng: 35.0461, status: 'ON' },
  { id: 5, name: 'Одеса', lat: 46.4825, lng: 30.7233, status: 'ON' },
  { id: 6, name: 'Харків', lat: 50.0057, lng: 36.2292, status: 'OFF' }
];

const createCustomIcon = (status) => {
  const isON = status === 'ON';
  const color = isON ? C.yellow : '#ffffff';
  
  const html = `
    <div style="
      background-color: #000;
      border: 2px solid ${color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer; /* Робить маркер клікабельним (курсор-рука) */
      box-shadow: 0 0 15px ${isON ? 'rgba(250, 204, 21, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
      transition: all 0.2s ease-in-out;
    "
    onmouseover="this.style.transform='rotate(-45deg) scale(1.1)'"
    onmouseout="this.style.transform='rotate(-45deg) scale(1)'"
    >
      <span style="
        transform: rotate(45deg); 
        color: ${color}; 
        font-weight: 900; 
        font-size: 11px;
        font-family: 'Rajdhani', sans-serif;
      ">
        ${status}
      </span>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

export default function ClubsMap() {
  const [selectedClub, setSelectedClub] = useState(null);

  // Функція обробки кліку по головній кнопці
  const handleBookingClick = () => {
    if (selectedClub) {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Будь ласка, оберіть клуб на карті перед бронюванням!');
    }
  };

  return (
    <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      
      {/* Заголовок секції */}
      <h2 style={{
        textAlign: 'center',
        color: '#ffffff',
        fontSize: '42px',
        fontWeight: 900,
        marginBottom: '40px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        textShadow: '0 0 20px rgba(255,255,255,0.1)'
      }}>
        Наші <span style={{ color: C.yellow, textShadow: `0 0 20px rgba(250, 204, 21, 0.4)` }}>клуби</span>
      </h2>

      {/* Контейнер карти */}
      <div style={{ 
        position: 'relative', 
        border: `4px solid ${C.yellow}`, 
        borderRadius: '16px', 
        overflow: 'hidden',
        height: '600px',
        boxShadow: `0 0 40px rgba(250, 204, 21, 0.2)`,
        zIndex: 1
      }}>
        
        <MapContainer 
          center={[48.3794, 31.1656]} 
          zoom={6} 
          scrollWheelZoom={true} 
          style={{ width: '100%', height: '100%', backgroundColor: C.bg }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {CLUBS.map(club => (
            <Marker
              key={club.id}
              position={[club.lat, club.lng]}
              icon={createCustomIcon(club.status)}
              eventHandlers={{
                click: () => setSelectedClub(club),
              }}
            />
          ))}
        </MapContainer>

        {/* Кнопка бронювання */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none', 
          zIndex: 1000 
        }}>
          <button 
            onClick={handleBookingClick}
            style={{
              pointerEvents: 'auto', 
              background: C.yellow,
              color: '#000',
              border: 'none',
              padding: '20px 60px',
              fontSize: '20px',
              fontWeight: 900,
              borderRadius: '12px',
              cursor: 'pointer', /* Вказуємо, що це кнопка */
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              letterSpacing: '1px',
              transition: 'all 0.2s ease-in-out',
              minWidth: '400px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(250, 204, 21, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
          >
            {selectedClub ? `ЗАБРОНЮВАТИ: ${selectedClub.name.toUpperCase()}` : 'ЗАБРОНЮВАТИ МІСЦЕ'}
          </button>
        </div>

      </div>
    </div>
  );
}