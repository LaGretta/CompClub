import React, { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
// Видалили імпорт Reveal, щоб не конфліктувало і не ховало контент
import { bookingsApi, usersApi } from '../services/api';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b', surface: '#121214', surfaceLight: '#18181b' };

function useAnimatedBalance(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue || 0;
    const safeTarget = targetValue || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(startValue + (safeTarget - startValue) * easeOut);
      setDisplayValue(currentVal);
      if (progress < 1) window.requestAnimationFrame(step);
      else setDisplayValue(safeTarget);
    };
    window.requestAnimationFrame(step);
  }, [targetValue]);
  return displayValue;
}

export default function Profile() {
  const { isAuthenticated, userName, avatar, balance, logout, updateAvatar, refreshProfile } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animatedBalance = useAnimatedBalance(balance || 0);

  const handleCancel = async (id, price) => {
    setCancellingId(id);
    try {
      await bookingsApi.cancel(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 2 } : b)));
      
      const currentBalance = Number(localStorage.getItem('localUserBalance')) || 2000;
      localStorage.setItem('localUserBalance', currentBalance + (price || 0));
      
      await refreshProfile();
      showToast('Бронювання успішно скасовано! Кошти повернено.', 'success');
    } catch (e) {
      showToast(`Не вдалося скасувати: ${e.message}`, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMyBookings = async () => {
        try {
          const data = await bookingsApi.getMy();
          
          let safeArray = [];
          if (Array.isArray(data)) {
            safeArray = [...data];
          } else if (data && Array.isArray(data.data)) {
            safeArray = [...data.data];
          }
          
          safeArray.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
          setBookings(safeArray);

        } catch (error) {
          console.error("Не вдалося завантажити бронювання", error);
          setBookings([]);
        } finally {
          setIsLoadingBookings(false);
        }
      };
      fetchMyBookings();
    }
  }, [isAuthenticated]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
        showToast('Аватарку успішно оновлено!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 0: return { text: 'Активне', color: C.yellow, bg: 'rgba(250, 204, 21, 0.15)', border: 'rgba(250, 204, 21, 0.3)' };
      case 1: return { text: 'Завершено', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' }; 
      case 2: return { text: 'Скасовано', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' }; 
      default: return { text: 'Невідомо', color: C.muted, bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  const glassCardStyle = {
    background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid rgba(63, 63, 70, 0.5)`, borderRadius: '16px', padding: isMobile ? '20px' : '32px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)', position: 'relative', overflow: 'hidden',
    animation: 'fadeIn 0.5s ease-in'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingTop: isMobile ? '90px' : '120px', paddingBottom: '80px', color: '#fff', fontFamily: "'Rajdhani', sans-serif", overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '32px' }}>
        
        <div style={{ flex: isMobile ? '1 1 100%' : '1 1 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ ...glassCardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: C.yellow, filter: 'blur(80px)', opacity: 0.1 }}></div>

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
            >
              {avatar ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: C.yellow, fontWeight: 900, fontSize: '56px', textTransform: 'uppercase' }}>{userName ? userName.charAt(0) : 'G'}</span>}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease' }}><span style={{ color: '#fff', fontSize: '13px', fontWeight: 800, letterSpacing: '2px' }}>ЗМІНИТИ</span></div>
            </div>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
            
            <h2 style={{ fontSize: isMobile ? '26px' : '32px', fontWeight: 900, margin: '0 0 4px 0', letterSpacing: '1.5px', textShadow: '0 2px 10px rgba(0,0,0,0.5)', zIndex: 2, textAlign: 'center', wordBreak: 'break-all' }}>{userName || 'ГРАВЕЦЬ'}</h2>
            <span style={{ background: 'rgba(250, 204, 21, 0.1)', color: C.yellow, fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', padding: '6px 12px', borderRadius: '999px', marginBottom: '32px', border: `1px solid rgba(250, 204, 21, 0.3)`, zIndex: 2 }}>Гість клубу</span>

            <button 
              onClick={() => { logout(); showToast('Ви успішно вийшли з акаунту', 'success'); navigate('/'); }}
              style={{ width: '100%', padding: '14px', background: 'rgba(239, 68, 68, 0.05)', border: `1px solid rgba(239, 68, 68, 0.3)`, color: '#ef4444', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '1px', zIndex: 2 }}
              onMouseEnter={e => { e.target.style.background = 'rgba(239, 68, 68, 0.15)'; e.target.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)'; }}
              onMouseLeave={e => { e.target.style.background = 'rgba(239, 68, 68, 0.05)'; e.target.style.boxShadow = 'none'; }}
            >
              ВИЙТИ З АКАУНТУ
            </button>
          </div>

          <div style={{ ...glassCardStyle, border: `1px solid rgba(250, 204, 21, 0.3)` }}>
            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '150px', height: '150px', background: C.yellow, filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }}></div>
            <p style={{ margin: '0 0 8px 0', color: C.muted, fontWeight: 700, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>Твій баланс</p>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '48px', fontWeight: 900, color: C.yellow, letterSpacing: '2px', textShadow: '0 0 20px rgba(250,204,21,0.3)' }}>
              {animatedBalance} <span style={{ fontSize: '24px', color: '#fff' }}>₴</span>
            </h3>
            <button 
              onClick={async () => { 
                try {
                  await usersApi.topUp(500); 
                  await refreshProfile(); 
                  showToast('Баланс успішно поповнено на 500 ₴!', 'success');
                } catch (e) {
                  showToast(e.message, 'error');
                }
              }}
              style={{ width: '100%', padding: '16px', background: C.yellow, color: '#000', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 900, cursor: 'pointer', letterSpacing: '1px', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(250, 204, 21, 0.3)', position: 'relative', zIndex: 2 }} 
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(250, 204, 21, 0.5)'; }} 
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(250, 204, 21, 0.3)'; }}
            >
              ПОПОВНИТИ РАХУНОК (+500)
            </button>
          </div>
        </div>

        <div style={{ flex: isMobile ? '1 1 100%' : '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={glassCardStyle}>
            <h3 style={{ margin: '0 0 32px 0', fontSize: '24px', fontWeight: 900, letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase' }}>
              <span style={{ width: '12px', height: '24px', background: C.yellow, borderRadius: '4px', display: 'inline-block', boxShadow: '0 0 10px rgba(250,204,21,0.5)' }}></span>
              Історія бронювань
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isLoadingBookings ? (
                <p style={{ color: C.muted, textAlign: 'center', padding: '20px' }}>Завантаження історії...</p>
              ) : bookings.length > 0 ? (
                bookings.map((booking, index) => {
                  const statusInfo = getStatusInfo(booking.status);
                  const startDate = new Date(booking.startTime || Date.now());
                  const endDate = new Date(booking.endTime || Date.now());
                  const dateString = `${startDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}, ${startDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`;

                  return (
                    <div 
                      key={booking.id || index}
                      style={{ 
                        display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', 
                        padding: '24px', gap: '16px', background: 'rgba(255, 255, 255, 0.02)', border: `1px solid rgba(255, 255, 255, 0.05)`, 
                        borderRadius: '12px', transition: 'all 0.3s ease', cursor: 'default'
                      }} 
                      onMouseEnter={e => { if(!isMobile) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform = 'translateX(8px)'; e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.2)'; } }} 
                      onMouseLeave={e => { if(!isMobile) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; } }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>
                          Комп'ютер #{booking.computerId || '?'}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: C.muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '16px' }}>🕒</span> {dateString}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: isMobile ? 'row-reverse' : 'column', alignItems: isMobile ? 'center' : 'flex-end', justifyContent: 'space-between', width: isMobile ? '100%' : 'auto', gap: '10px', marginTop: isMobile ? '8px' : '0' }}>
                        <span style={{ fontSize: '22px', fontWeight: 900, color: C.yellow, textShadow: '0 0 10px rgba(250,204,21,0.2)' }}>
                          {booking.totalPrice || 0} ₴
                        </span>
                        <span style={{ 
                          fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '6px', letterSpacing: '1px', textTransform: 'uppercase',
                          background: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.border}`
                        }}>
                          {statusInfo.text}
                        </span>
                        {booking.status === 0 && (
                          <button
                            onClick={() => handleCancel(booking.id, booking.totalPrice)}
                            disabled={cancellingId === booking.id}
                            style={{ background: 'none', border: `1px solid rgba(239,68,68,0.4)`, color: '#ef4444', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '6px', cursor: cancellingId === booking.id ? 'not-allowed' : 'pointer', letterSpacing: '1px', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            {cancellingId === booking.id ? '...' : 'СКАСУВАТИ'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: C.muted, textAlign: 'center', padding: '20px', fontSize: '16px' }}>
                  Ви ще не зробили жодного бронювання. Час це виправити!
                </p>
              )}
            </div>
            
            <button 
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              style={{ marginTop: '32px', width: '100%', padding: '18px', background: 'rgba(250, 204, 21, 0.05)', color: C.yellow, border: `1px dashed rgba(250, 204, 21, 0.4)`, borderRadius: '12px', fontSize: '16px', fontWeight: 900, cursor: 'pointer', letterSpacing: '2px', transition: 'all 0.2s' }} 
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.1)'; e.currentTarget.style.borderStyle = 'solid'; e.currentTarget.style.transform = 'scale(1.02)'; }} 
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.05)'; e.currentTarget.style.borderStyle = 'dashed'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              + СТВОРИТИ НОВЕ БРОНЮВАННЯ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}