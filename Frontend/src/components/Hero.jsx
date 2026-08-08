import React from 'react';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b' };

const INFO_TICKER = [
  "🔥 ЗНИЖКА 30% НА РАНКОВІ ПАКЕТИ (08:00 - 14:00)",
  "🏆 РЕЄСТРАЦІЯ НА ЛІТНІЙ ТУРНІР З CS2 ВЖЕ ВІДКРИТА",
  "🎮 ТОПОВІ ЗБІРКИ НА БАЗІ RTX 5080 TI SUPER ТА 360HZ МОНІТОРІВ",
  "⚡️ ПРАЦЮЄМО 24/7 БЕЗ ВИХІДНИХ ТА ПЕРЕРВ",
  "🍔 ENERGY BAR: НОВІ КРАФТОВІ ЛИМОНАДИ ТА СНЕКИ"
];

export default function Hero() {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'transparent' 
    }}>
      
      {/*Стрічка */}
      <div className="ticker-container" style={{
        position: 'fixed',
        top: '80px',
        left: 0,
        width: '100%',
        zIndex: 40,
        background: 'rgba(9, 9, 11, 0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(250, 204, 21, 0.2)', 
        borderBottom: '1px solid rgba(250, 204, 21, 0.3)',
        padding: '10px 0',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div className="ticker-wrapper">
          {[...INFO_TICKER, ...INFO_TICKER].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '0 40px', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {item}
              </span>
              <span style={{ 
                color: C.yellow, 
                margin: '0 40px', 
                fontSize: '16px', 
                textShadow: '0 0 10px rgba(250,204,21,0.6)' 
              }}>
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: '-5%', left: '-5%', right: '-5%', 
        bottom: 0, 
        backgroundImage: "url('/PC.png')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px)',
        zIndex: 0,
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)'
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(9, 9, 11, 0.5) 0%, rgba(9, 9, 11, 0.9) 60%, transparent 100%)',
        zIndex: 1
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: '900px',
        marginTop: '100px'
      }}>
        
        <h1 style={{
          fontSize: 'clamp(60px, 10vw, 120px)',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          lineHeight: 1,
          margin: '0 0 20px 0',
          textShadow: '0 0 30px rgba(250, 204, 21, 0.3)' 
        }}>
          Hexa<span style={{ color: C.yellow }}>Gon</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 3vw, 22px)',
          fontWeight: 600,
          color: '#e4e4e7',
          lineHeight: 1.6,
          margin: '0 0 40px 0',
          maxWidth: '700px'
        }}>
          Максимальний FPS, нульовий ping. Найкращий кіберклуб в Україні для тих, хто не йде на компроміси.
        </p>

        <button 
          onClick={scrollToBooking}
          style={{
            background: C.yellow,
            color: '#000',
            border: 'none',
            padding: '18px 48px',
            borderRadius: '9999px',
            fontSize: '16px',
            fontWeight: 900,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 30px rgba(250, 204, 21, 0.6)';
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 0 20px rgba(250, 204, 21, 0.4)';
          }}
        >
          Забронювати ПК
        </button>

      </div>
    </section>
  );
}