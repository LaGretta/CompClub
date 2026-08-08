import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import { AuthContext } from '../context/AuthContext';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b', surface: '#121214' };

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Дістаємо аватарку з контексту
  const { isAuthenticated, userName, avatar, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = ({ id, path }) => {
    if (location.pathname !== path) {
      navigate(path);
      setTimeout(() => {
        if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo(0, 0);
      }, 100);
    } else {
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(8, 8, 8, 0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        transition: 'all 0.3s ease', padding: '16px 24px'
      }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div onClick={() => handleNavigation({ path: '/' })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', zIndex: 55 }}>
            <img src="/logo.png" alt="Hexagon Logo" style={{ height: '48px', objectFit: 'contain', filter: 'drop-shadow(0px 0px 8px rgba(250, 204, 21, 0.6))' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>Hexa</span>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#000', background: C.yellow, padding: '0px 6px', borderRadius: '6px', letterSpacing: '0.5px' }}>Gon</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[
              { name: 'ГОЛОВНА', id: null, path: '/' },
              { name: 'ПРО НАС', id: 'features', path: '/' },
              { name: 'ТАРИФИ ТА ЗОНИ', id: 'zones', path: '/' },
              { name: 'БРОНЮВАННЯ', id: 'booking', path: '/' },
              { name: 'ТУРНІРИ', id: null, path: '/tournaments' },
              { name: 'ЗВ\'ЯЗОК', id: 'footer', path: '/' }
            ].map(item => (
              <button key={item.name} onClick={() => handleNavigation({ id: item.id, path: item.path })} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', transition: 'color 0.2s', letterSpacing: '0.5px' }} onMouseEnter={e => e.target.style.color = C.yellow} onMouseLeave={e => e.target.style.color = '#fff'}>
                {item.name}
              </button>
            ))}
          </div>

          <div>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div onClick={() => navigate('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#18181b', border: `2px solid ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {avatar ? (
                      <img src={avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: C.yellow, fontWeight: 900, fontSize: '18px', textTransform: 'uppercase' }}>
                        {userName ? userName.charAt(0) : 'G'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>{userName || 'Гравець'}</span>
                    <span style={{ color: C.muted, fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Гість клубу</span>
                  </div>
                </div>
                
                <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = C.muted} title="Вийти">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} style={{ background: C.yellow, color: '#000', border: 'none', padding: '12px 36px', borderRadius: 999, fontWeight: 900, fontSize: 15, letterSpacing: 1, cursor: 'pointer', transition: 'transform 0.2s', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)' }} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
                Увійти
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}