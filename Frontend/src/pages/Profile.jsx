import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Reveal from '../components/Reveal'; // Додаємо анімації

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b', surface: '#121214', surfaceLight: '#18181b' };

export default function Profile() {
  const { isAuthenticated, userName, avatar, logout, updateAvatar } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const dummyBookings = [
    { id: 1, pc: 'PC-12 (VIP)', date: 'Сьогодні, 18:00 - 21:00', price: '300 ₴', status: 'Активне' },
    { id: 2, pc: 'PC-05 (Standart)', date: 'Вчора, 14:00 - 16:00', price: '150 ₴', status: 'Завершено' },
    { id: 3, pc: 'PS5 Zone', date: '10 Лип, 20:00 - 23:00', price: '450 ₴', status: 'Завершено' },
  ];

  const glassCardStyle = {
    background: 'rgba(9, 9, 11, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid rgba(63, 63, 70, 0.5)`,
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingTop: '120px', paddingBottom: '80px', color: '#fff', fontFamily: "'Rajdhani', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/*Ліва колонка*/}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <Reveal direction="left" delay={100}>
            <div style={{ ...glassCardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: C.yellow, filter: 'blur(80px)', opacity: 0.1 }}></div>

              {/*Аватарка*/}
              <div 
                onClick={() => fileInputRef.current.click()}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ 
                  width: '130px', height: '130px', borderRadius: '50%', backgroundColor: 'rgba(24, 24, 27, 0.8)', 
                  border: `3px solid ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isHovered ? `0 0 40px rgba(250, 204, 21, 0.6)` : `0 0 25px rgba(250, 204, 21, 0.3)`, 
                  marginBottom: '24px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.3s ease', zIndex: 2
                }}
                title="Натисніть, щоб змінити аватарку"
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: C.yellow, fontWeight: 900, fontSize: '56px', textTransform: 'uppercase' }}>
                    {userName ? userName.charAt(0) : 'G'}
                  </span>
                )}

                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(3px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease'
                }}>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 800, letterSpacing: '2px' }}>ЗМІНИТИ</span>
                </div>
              </div>

              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
              
              <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 4px 0', letterSpacing: '1.5px', textShadow: '0 2px 10px rgba(0,0,0,0.5)', zIndex: 2 }}>
                {userName || 'ГРАВЕЦЬ'}
              </h2>
              <span style={{ background: 'rgba(250, 204, 21, 0.1)', color: C.yellow, fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', padding: '6px 12px', borderRadius: '999px', marginBottom: '32px', border: `1px solid rgba(250, 204, 21, 0.3)`, zIndex: 2 }}>
                Гість клубу
              </span>

              <button 
                onClick={() => { logout(); navigate('/'); }}
                style={{ width: '100%', padding: '14px', background: 'rgba(239, 68, 68, 0.05)', border: `1px solid rgba(239, 68, 68, 0.3)`, color: '#ef4444', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '1px', zIndex: 2 }}
                onMouseEnter={e => { e.target.style.background = 'rgba(239, 68, 68, 0.15)'; e.target.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(239, 68, 68, 0.05)'; e.target.style.boxShadow = 'none'; }}
              >
                ВИЙТИ З АКАУНТУ
              </button>
            </div>
          </Reveal>

          {/*Баланс*/}
          <Reveal direction="up" delay={200}>
            <div style={{ ...glassCardStyle, border: `1px solid rgba(250, 204, 21, 0.3)` }}>
              <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '150px', height: '150px', background: C.yellow, filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }}></div>
              <p style={{ margin: '0 0 8px 0', color: C.muted, fontWeight: 700, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>Твій баланс</p>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '48px', fontWeight: 900, color: C.yellow, letterSpacing: '2px', textShadow: '0 0 20px rgba(250,204,21,0.3)' }}>
                150 <span style={{ fontSize: '24px', color: '#fff' }}>₴</span>
              </h3>
              <button 
                style={{ width: '100%', padding: '16px', background: C.yellow, color: '#000', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 900, cursor: 'pointer', letterSpacing: '1px', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(250, 204, 21, 0.3)', position: 'relative', zIndex: 2 }} 
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(250, 204, 21, 0.5)'; }} 
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(250, 204, 21, 0.3)'; }}
              >
                ПОПОВНИТИ РАХУНОК
              </button>
            </div>
          </Reveal>
        </div>

        {/*Права колонка*/}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Reveal direction="right" delay={300}>
            <div style={glassCardStyle}>
              <h3 style={{ margin: '0 0 32px 0', fontSize: '24px', fontWeight: 900, letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase' }}>
                <span style={{ width: '12px', height: '24px', background: C.yellow, borderRadius: '4px', display: 'inline-block', boxShadow: '0 0 10px rgba(250,204,21,0.5)' }}></span>
                Історія бронювань
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dummyBookings.map((booking, index) => (
                  <Reveal key={booking.id} direction="up" delay={400 + (index * 100)}>
                    <div 
                      style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', 
                        background: 'rgba(255, 255, 255, 0.02)', border: `1px solid rgba(255, 255, 255, 0.05)`, 
                        borderRadius: '12px', transition: 'all 0.3s ease', cursor: 'default'
                      }} 
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform = 'translateX(8px)'; e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.2)'; }} 
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>{booking.pc}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: C.muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '16px' }}>🕒</span> {booking.date}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <span style={{ fontSize: '22px', fontWeight: 900, color: C.yellow, textShadow: '0 0 10px rgba(250,204,21,0.2)' }}>{booking.price}</span>
                        <span style={{ 
                          fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '6px', letterSpacing: '1px', textTransform: 'uppercase',
                          background: booking.status === 'Активне' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                          color: booking.status === 'Активне' ? C.yellow : C.muted,
                          border: booking.status === 'Активне' ? `1px solid rgba(250, 204, 21, 0.3)` : `1px solid rgba(255, 255, 255, 0.1)`
                        }}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              
              <Reveal direction="up" delay={700}>
                <button 
                  style={{ marginTop: '32px', width: '100%', padding: '18px', background: 'rgba(250, 204, 21, 0.05)', color: C.yellow, border: `1px dashed rgba(250, 204, 21, 0.4)`, borderRadius: '12px', fontSize: '16px', fontWeight: 900, cursor: 'pointer', letterSpacing: '2px', transition: 'all 0.2s' }} 
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.1)'; e.currentTarget.style.borderStyle = 'solid'; e.currentTarget.style.transform = 'scale(1.02)'; }} 
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.05)'; e.currentTarget.style.borderStyle = 'dashed'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  + СТВОРИТИ НОВЕ БРОНЮВАННЯ
                </button>
              </Reveal>
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
}