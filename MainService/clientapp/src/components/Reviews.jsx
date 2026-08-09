import React from 'react';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', surface: '#18181b', bg: '#09090b' };

const REVIEWS_DATA = [
  { 
    text: "Найкращі монітори 360Hz в місті! Пінг ідеальний, нуль лагів, грати мікси з друзями — одне задоволення. Однозначно топ-1.", 
    author: "Oleh Prokopiv", 
    role: "Гравець CS2" 
  },
  { 
    text: "VIP кімната просто розрив! Збирались командою на буткемп, залізо тягне все на максималках. Атмосфера 10/10.", 
    author: "Sviatoslav Ostyak", 
    role: "Капітан команди" 
  },
  { 
    text: "Топ залізо, катали всю ніч. Дуже зручні крісла і приємні адміни. Окремий плюс за енергетики в барі вночі.", 
    author: "Edik Kosmachevskyi", 
    role: "Гість клубу" 
  }
];

export default function Reviews() {
  return (
    <section id="reviews" style={{ padding: '100px 24px', background: 'transparent', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: 2, textTransform: 'uppercase' }}>
            ЩО КАЖУТЬ <span style={{ color: C.yellow }}>ГРАВЦІ</span>
          </h2>
          <p style={{ color: C.muted, fontSize: 16, marginTop: 12, letterSpacing: 1 }}>Реальні відгуки нашого ком'юніті</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {REVIEWS_DATA.map((rev, index) => (
            <div key={index} style={{
              background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(10px)',
              padding: 40, borderRadius: 12, border: `1px solid ${C.border}`,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.yellow; e.currentTarget.style.transform = 'translateY(-4px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill={C.yellow}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p style={{ color: '#e2e8f0', fontSize: 16, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 32 }}>
                  "{rev.text}"
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(250,204,21,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.yellow, fontWeight: 800, fontSize: 20 }}>
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>{rev.author}</div>
                  <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}