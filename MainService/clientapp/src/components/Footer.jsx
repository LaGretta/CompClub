import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b', surface: '#121214' };

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = ({ id, path }) => {
    if (location.pathname !== path) {
      navigate(path);
      setTimeout(() => {
        if (id) {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
    } else {
      if (id) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="footer" style={{ background: C.bg, paddingTop: '60px', paddingBottom: '24px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          
          {/* Бренд */}
          <div>
            <div 
              onClick={() => handleNavigation({ path: '/' })}
              style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer', width: 'fit-content' }}
            >
              <img 
                src="/logo.png" 
                alt="Hexagon Logo" 
                style={{ height: '36px', marginRight: '12px', filter: 'drop-shadow(0px 0px 8px rgba(250, 204, 21, 0.6))' }} 
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>Hexa</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#000', background: C.yellow, padding: '0px 6px', borderRadius: '4px', letterSpacing: '0.5px' }}>Gon</span>
              </div>
            </div>
            <p style={{ color: C.muted, fontSize: '14px', lineHeight: '1.6', maxWidth: '320px' }}>
              Преміальний кіберспортивний простір в Тернополі. Топове залізо, атмосфера для перемог та цілодобовий доступ до улюблених ігор.
            </p>
          </div>

          {/* Навігація */}
          <div>
            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px' }}>НАВІГАЦІЯ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'Головна', id: null, path: '/' },
                { name: 'Про нас', id: 'features', path: '/' },
                { name: 'Тарифи та Зони', id: 'zones', path: '/' },
                { name: 'Бронювання', id: 'booking', path: '/' },
                { name: 'Турніри', id: null, path: '/tournaments' }
              ].map(item => (
                <button 
                  key={item.name}
                  onClick={() => handleNavigation({ id: item.id, path: item.path })}
                  style={{ 
                    background: 'none', border: 'none', color: C.muted, fontSize: '14px', 
                    textAlign: 'left', cursor: 'pointer', transition: 'color 0.2s', padding: 0,
                    width: 'fit-content'
                  }}
                  onMouseEnter={e => e.target.style.color = C.yellow}
                  onMouseLeave={e => e.target.style.color = C.muted}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Контакти */}
          <div>
            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px' }}>КОНТАКТИ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: C.muted, fontSize: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: '#ec4899', fontSize: '18px' }}>📍</span>
                <span>вул. Корольова, 3<br/>Тернопіль, Україна</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#ec4899', fontSize: '18px' }}>📞</span>
                <span>+38 (070) 111-999</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#d8b4fe', fontSize: '18px' }}>✉️</span>
                <span>info@hexagon.ua</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#9ca3af', fontSize: '18px' }}>🕒</span>
                <span>Працюємо 24/7 (без вихідних)</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Нижня панель */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.border}`, paddingTop: '24px' }}>
          <div style={{ color: C.muted, fontSize: '12px' }}>
            © 2026 Hexagon. Всі права захищені.
          </div>
          <div style={{ display: 'flex', gap: '24px', fontWeight: 800, color: '#fff', fontSize: '12px', letterSpacing: '0.5px' }}>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = C.yellow} onMouseLeave={e => e.target.style.color = '#fff'}>INSTAGRAM</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = C.yellow} onMouseLeave={e => e.target.style.color = '#fff'}>TELEGRAM</a>
            <a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = C.yellow} onMouseLeave={e => e.target.style.color = '#fff'}>TIKTOK</a>
          </div>
        </div>

      </div>
    </footer>
  );
}