import React from 'react';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', surface: '#18181b' };

const FEATURES_DATA = [
  {
    id: 1,
    title: 'БЕЗКОМПРОМІСНЕ ЗАЛІЗО',
    desc: 'Граємо на максималках. ПК на базі RTX 5070/5080 та процесорів Intel Core i7/i9. Монітори Zowie 360Hz для абсолютної переваги.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
  },
  {
    id: 2,
    title: 'LOUNGE & PS5',
    desc: 'Окрема чил-зона з величезними 4K телевізорами, останніми ексклюзивами на PlayStation 5 та зручними диванами для відпочинку з друзями.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
  },
  {
    id: 3,
    title: 'КІБЕРТУРНІРИ',
    desc: 'Регулярні LAN-турніри з CS2 та Dota 2 з реальними призовими фондами. Збери команду та доведи, що ви найкращі на арені.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
  },
  {
    id: 4,
    title: 'ENERGY BAR',
    desc: 'Заряджайся не відходячи від каси. У нас є все: від потужних енергетиків та лимонадів до смачних снеків для довгих нічних каток.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
  }
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '120px 24px', background: 'transparent', position: 'relative', zIndex: 10 }}>
      
      {/* Стилі для адаптивності та ховер-ефектів */}
      <style>{`
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: stretch;
        }
        
        .feature-card {
          background: ${C.surface}; /* СУЦІЛЬНИЙ ЧОРНИЙ ФОН (ніякого скла) */
          border: 1px solid ${C.border};
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          border-color: ${C.yellow};
          transform: translateX(10px); /* Легкий зсув вправо при наведенні */
          box-shadow: -10px 10px 30px rgba(0,0,0,0.5);
        }

        .feature-icon-wrapper {
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon-wrapper {
          background: rgba(250, 204, 21, 0.2) !important;
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.4);
          transform: scale(1.05);
        }

        .feature-image-container {
          position: relative;
          width: 100%;
          min-height: 600px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid ${C.border};
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }

        .feature-image {
          position: absolute;
          inset: 0;
          background-image: url('/ps.png'); 
          background-size: cover;
          background-position: center;
          transition: transform 0.7s ease;
        }

        .feature-image-container:hover .feature-image {
          transform: scale(1.05); /* Зум картинки при наведенні */
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .feature-image-container {
            min-height: 400px;
          }
          .feature-card:hover {
            transform: translateY(-5px); /* На телефоні зсув вверх, а не вправо */
          }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <span style={{ width: 40, height: 1, background: C.border }} />
            <span style={{ color: C.yellow, fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>Більше ніж просто ПК</span>
            <span style={{ width: 40, height: 1, background: C.border }} />
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: 2 }}>
            Простір <span style={{ color: C.yellow, textShadow: '0 0 20px rgba(250,204,21,0.3)' }}>Кіберспорту</span>
          </h2>
        </div>

        <div className="features-grid">
          <div className="feature-image-container">
            <div className="feature-image" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,9,11,0.1), rgba(9,9,11,0.8))' }} />
            
            <div style={{ 
              position: 'absolute', 
              bottom: 32, 
              left: 32, 
              background: 'rgba(9, 9, 11, 0.95)', 
              padding: '16px 24px', 
              borderLeft: `4px solid ${C.yellow}`, 
              borderRadius: 4 
            }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1 }}>24/7</div>
              <div style={{ fontSize: 12, color: C.yellow, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>Відкриті для тебе</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
            {FEATURES_DATA.map((feature) => (
              <div key={feature.id} className="feature-card" style={{ 
                display: 'flex', 
                gap: 20, 
                padding: '24px 32px', 
                borderRadius: 8 
              }}>
                
                {/* Іконка */}
                <div className="feature-icon-wrapper" style={{ 
                  flexShrink: 0, 
                  width: 56, 
                  height: 56, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'rgba(250, 204, 21, 0.1)', 
                  border: `1px solid rgba(250, 204, 21, 0.3)`, 
                  borderRadius: 8, 
                  color: C.yellow 
                }}>
                  {feature.icon}
                </div>
                
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.5 }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}