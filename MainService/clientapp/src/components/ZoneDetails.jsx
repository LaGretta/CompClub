import React from 'react';
import Reveal from './Reveal';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', surface: '#18181b', bg: '#09090b' };

const ZONES_INFO = [
  {
    id: 'standard',
    name: 'СТАНДАРТ',
    desc: 'Ідеальний баланс для комфортної гри з друзями на високих налаштуваннях.',
    price: 'від 100 ₴ / год',
    pc: [
      { label: 'GPU', val: 'GeForce RTX 5060 TI' },
      { label: 'CPU', val: 'Intel Core i5-13400F' },
      { label: 'RAM', val: '16GB DDR5 5200MHz' },
      { label: 'Монітор', val: '24" IPS 144Hz (1ms)' }
    ],
    devices: [
      { label: 'Клавіатура', val: 'Механічна (Тактильні свічі)' },
      { label: 'Миша', val: 'Logitech G102' },
      { label: 'Гарнітура', val: 'Logitech G335' }
    ]
  },
  {
    id: 'pro',
    name: 'PRO (CS2 / DOTA 2)',
    desc: 'Турнірний стандарт. Максимальний FPS та ідеальна точність для змагань.',
    price: 'від 140 ₴ / год',
    isPopular: true,
    pc: [
      { label: 'GPU', val: 'GeForce RTX 5070 TI SUPER' },
      { label: 'CPU', val: 'Intel Core i7-14700KF' },
      { label: 'RAM', val: '32GB DDR5 6000MHz' },
      { label: 'Монітор', val: '25" Zowie 240Hz (DyAc+)' }
    ],
    devices: [
      { label: 'Клавіатура', val: 'Logitech G Pro X TKL' },
      { label: 'Миша', val: 'Кастомні (Сенсор PixArt 3950)' },
      { label: 'Гарнітура', val: 'SteelSeries Arctis Nova 1' },
      { label: 'Килимок', val: 'Premium Speed & Control' }
    ]
  },
  {
    id: 'vip',
    name: 'VIP BOOTCAMP',
    desc: 'Ультимативний геймінг. Закрита кімната для команди з найкращим залізом на ринку.',
    price: 'від 200 ₴ / год',
    pc: [
      { label: 'GPU', val: 'GeForce RTX 5080 TI SUPER' },
      { label: 'CPU', val: 'Intel Core i9-14900K' },
      { label: 'RAM', val: '64GB DDR5 6400MHz' },
      { label: 'Монітор', val: '27" OLED 360Hz (0.03ms)' }
    ],
    devices: [
      { label: 'Клавіатура', val: 'Razer Huntsman V3 Pro' },
      { label: 'Миша', val: 'Logitech G Pro X Superlight 2' },
      { label: 'Гарнітура', val: 'SteelSeries Arctis Nova 3' }
    ]
  }
];

export default function ZoneDetails() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="zones" style={{ padding: '100px 24px', background: 'transparent', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <Reveal direction="down">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: 2, textTransform: 'uppercase' }}>
              ІГРОВІ <span style={{ color: C.yellow }}>ЗОНИ</span>
            </h2>
            <p style={{ color: C.muted, fontSize: 16, marginTop: 12, letterSpacing: 1 }}>Обирай свою зброю для перемоги</p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {ZONES_INFO.map((zone, index) => (
            <Reveal key={zone.id} direction="up" delay={index * 150}>
              <div style={{
                background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(10px)', 
                borderRadius: 12, padding: 32, border: `1px solid ${zone.isPopular ? C.yellow : C.border}`,
                position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
                boxShadow: zone.isPopular ? '0 10px 30px rgba(250,204,21,0.1)' : 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(250,204,21,0.15)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = zone.isPopular ? '0 10px 30px rgba(250,204,21,0.1)' : 'none' }}
              >
                
                {zone.isPopular && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: C.yellow, color: '#000', padding: '4px 16px', borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 2 }}>
                    ХІТ СЕРЕД ГРАВЦІВ
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: `1px dashed ${C.border}` }}>
                  <h3 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: 1, marginBottom: 8 }}>{zone.name}</h3>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5, minHeight: 40 }}>{zone.desc}</p>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.yellow, marginTop: 16 }}>{zone.price}</div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.yellow, letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    🖥 СИСТЕМНИЙ БЛОК
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {zone.pc.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: C.muted }}>{item.label}:</span>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 32, flexGrow: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.yellow, letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    🖱 ДЕВАЙСИ
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {zone.devices.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: C.muted }}>{item.label}:</span>
                        <span style={{ color: '#fff', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => scrollTo('booking')} style={{
                  width: '100%', padding: '16px', background: zone.isPopular ? C.yellow : 'transparent',
                  color: zone.isPopular ? '#000' : '#fff', border: `1px solid ${C.yellow}`, borderRadius: 8,
                  fontSize: 14, fontWeight: 800, letterSpacing: 2, cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!zone.isPopular) { e.target.style.background = 'rgba(250,204,21,0.1)' }
                  else { e.target.style.transform = 'scale(1.02)' }
                }}
                onMouseLeave={(e) => {
                  if (!zone.isPopular) { e.target.style.background = 'transparent' }
                  else { e.target.style.transform = 'scale(1)' }
                }}
                >
                  ЗАБРОНЮВАТИ ЗОНУ
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}