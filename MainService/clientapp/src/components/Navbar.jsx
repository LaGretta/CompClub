import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b', surface: '#121214' };

export default function Navbar() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticated, userName, avatar, logout } = useContext(AuthContext);

  const navLinks = [
    { name: 'ГОЛОВНА', id: null, path: '/' },
    { name: 'ПРО НАС', id: 'features', path: '/' },
    { name: 'ТАРИФИ ТА ЗОНИ', id: 'zones', path: '/' },
    { name: 'БРОНЮВАННЯ', id: 'booking', path: '/' },
    { name: 'ТУРНІРИ', id: null, path: '/tournaments' },
    { name: 'ЗВ\'ЯЗОК', id: 'footer', path: '/' }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1150); // Трохи збільшив брейкпоінт, щоб вмістити іконки
      if (window.innerWidth >= 1150) setIsMobileMenuOpen(false); 
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavigation = ({ id, path }) => {
    setIsMobileMenuOpen(false); 
    if (location.pathname !== path) {
      navigate(path);
      setTimeout(() => {
        if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo(0, 0); 
      }, 50);
    } else {
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Компонент іконок соцмереж, щоб не дублювати код
  const SocialIcons = () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {/* TELEGRAM */}
      <a href="https://t.me/+35cwNp_lrxY2MDEy" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(24, 24, 27, 0.6)', border: `1px solid ${C.border}`, color: '#fff', textDecoration: 'none', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = C.yellow; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = C.yellow; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(24, 24, 27, 0.6)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.border; }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </a>
      {/* INSTAGRAM */}
      <a href="https://www.instagram.com/cyberion.ua/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(24, 24, 27, 0.6)', border: `1px solid ${C.border}`, color: '#fff', textDecoration: 'none', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = C.yellow; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = C.yellow; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(24, 24, 27, 0.6)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.border; }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
      {/* TIKTOK */}
      <a href="https://www.tiktok.com/@cyberion.ua" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(24, 24, 27, 0.6)', border: `1px solid ${C.border}`, color: '#fff', textDecoration: 'none', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = C.yellow; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = C.yellow; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(24, 24, 27, 0.6)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.border; }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg>
      </a>
    </div>
  );

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled || isMobileMenuOpen ? 'rgba(8, 8, 8, 0.85)' : 'transparent',
        backdropFilter: scrolled || isMobileMenuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || isMobileMenuOpen ? `1px solid ${C.border}` : '1px solid transparent',
        transition: 'all 0.3s ease', 
        padding: isMobile ? '12px 20px' : '16px 24px' 
      }}>
        <div style={{ maxWidth: 1300, width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 101 }}>
          <div onClick={() => handleNavigation({ path: '/' })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="/logo.png" alt="Hexagon Logo" style={{ height: isMobile ? '36px' : '44px', objectFit: 'contain', filter: 'drop-shadow(0px 0px 8px rgba(250, 204, 21, 0.6))', transition: 'height 0.3s ease' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: isMobile ? '8px' : '12px' }}>
              <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 900, color: '#fff', letterSpacing: '1px', transition: 'font-size 0.3s ease' }}>Hexa</span>
              <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 900, color: '#000', background: C.yellow, padding: '0px 6px', borderRadius: '6px', letterSpacing: '0.5px', transition: 'font-size 0.3s ease' }}>Gon</span>
            </div>
          </div>

          {!isMobile && (
            <>
              <div style={{ display: 'flex', gap: 'clamp(12px, 1.5vw, 24px)', alignItems: 'center' }}>
                {navLinks.map(item => (
                  <button key={item.name} onClick={() => handleNavigation({ id: item.id, path: item.path })} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'color 0.2s', letterSpacing: '0.5px' }} onMouseEnter={e => e.target.style.color = C.yellow} onMouseLeave={e => e.target.style.color = '#fff'}>
                    {item.name}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* БЛОК АВТОРИЗАЦІЇ */}
                <div style={{ flexShrink: 0 }}>
                  {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div onClick={() => handleNavigation({ path: '/profile' })} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#18181b', border: `2px solid ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {avatar ? (
                            <img src={avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ color: C.yellow, fontWeight: 900, fontSize: '16px', textTransform: 'uppercase' }}>
                              {userName ? userName.charAt(0) : 'G'}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px', marginBottom: '2px' }}>{userName || 'Гравець'}</span>
                          <span style={{ color: C.muted, fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Гість клубу</span>
                        </div>
                      </div>
                      
                      <button onClick={() => { logout(); showToast('Ви успішно вийшли з акаунту', 'success'); handleNavigation({ path: '/' }); }} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = C.muted} title="Вийти">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsAuthOpen(true)} style={{ background: C.yellow, color: '#000', border: 'none', padding: '10px 28px', borderRadius: 999, fontWeight: 900, fontSize: 14, letterSpacing: 1, cursor: 'pointer', transition: 'transform 0.2s', textTransform: 'uppercase', boxShadow: '0 0 15px rgba(250, 204, 21, 0.4)' }} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
                      Увійти
                    </button>
                  )}
                </div>

                {/* РОЗДІЛЮВАЧ */}
                <div style={{ width: '1px', height: '30px', background: C.border }}></div>

                {/* СОЦМЕРЕЖІ СХОВАЛИСЯ ТУТ */}
                <SocialIcons />
              </div>
            </>
          )}

          {/*Бургер меню*/}
          {isMobile && (
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
          )}
        </div>

        {/* ВИПАДАЮЧЕ МОБІЛЬНЕ МЕНЮ */}
        {isMobile && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(12, 12, 14, 0.98)', borderBottom: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px', gap: '20px',
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
            opacity: isMobileMenuOpen ? 1 : 0, visibility: isMobileMenuOpen ? 'visible' : 'hidden',
            pointerEvents: isMobileMenuOpen ? 'auto' : 'none', transition: 'all 0.3s ease-in-out',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            {navLinks.map(item => (
              <button key={item.name} onClick={() => handleNavigation({ id: item.id, path: item.path })} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 800, fontSize: 18, cursor: 'pointer', transition: 'color 0.2s', letterSpacing: '1px' }}>
                {item.name}
              </button>
            ))}

            <div style={{ width: '100%', height: '1px', background: C.border, margin: '8px 0' }}></div>

            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div onClick={() => handleNavigation({ path: '/profile' })} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#18181b', border: `2px solid ${C.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {avatar ? (
                      <img src={avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: C.yellow, fontWeight: 900, fontSize: '20px', textTransform: 'uppercase' }}>
                        {userName ? userName.charAt(0) : 'G'}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px', marginBottom: '4px' }}>{userName || 'Гравець'}</span>
                    <span style={{ color: C.muted, fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Гість клубу</span>
                  </div>
                </div>
                
                <button onClick={() => { setIsMobileMenuOpen(false); logout(); showToast('Ви успішно вийшли з акаунту', 'success'); handleNavigation({ path: '/' }); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#ef4444', fontWeight: 800, fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  ВИЙТИ
                </button>
              </div>
            ) : (
              <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }} style={{ background: C.yellow, color: '#000', border: 'none', padding: '14px 40px', borderRadius: 999, fontWeight: 900, fontSize: 16, letterSpacing: 1, cursor: 'pointer', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)' }}>
                Увійти
              </button>
            )}

            {/* СОЦМЕРЕЖІ У МОБІЛЬНОМУ МЕНЮ */}
            <div style={{ marginTop: '16px' }}>
              <SocialIcons />
            </div>
          </div>
        )}
      </nav>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}