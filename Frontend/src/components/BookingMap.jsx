import React, { useState } from 'react';

const C = { yellow: '#facc15', muted: '#a1a1aa', surface: '#18181b', bg: '#09090b', border: '#3f3f46' };

const ZONES = [
  { id: 'standard', name: 'СТАНДАРТ', sub: '', price: 100, morningPrice: 250, nightPrice: 400, seats: 20, booked: [2, 5, 8, 12, 15], specs: ['RTX 5060 TI', '144Hz IPS'] },
  { id: 'pro', name: 'PRO', sub: '(CS2 / DOTA 2)', price: 140, morningPrice: 350, nightPrice: 550, seats: 10, booked: [1, 3], specs: ['RTX 5070 TI SUPER', '240Hz Zowie'] },
  { id: 'vip', name: 'VIP', sub: 'BOOTCAMP', price: 200, morningPrice: 500, nightPrice: 800, seats: 5, booked: [4], specs: ['RTX 5080 TI SUPER', '360Hz OLED'] }
];

const TARIFFS = [
  { id: 'morning', name: 'Ранковий', sub: '08:00-14:00', type: 'fixed' },
  { id: 'standard', name: 'Стандарт', sub: 'Будь-який час', mult: 1.0, type: 'hourly' },
  { id: 'night', name: 'Нічний', sub: '22:00-08:00', type: 'fixed' }
];

export default function BookingMap({ onRequireAuth }) {
  const [zone, setZone] = useState(ZONES[1]);
  const [tariff, setTariff] = useState(TARIFFS[1]);
  const [hours, setHours] = useState(2);
  const [seat, setSeat] = useState(null);

  const calculateTotal = () => {
    if (tariff.id === 'morning') return zone.morningPrice || 0;
    if (tariff.id === 'night') return zone.nightPrice || 0;
    return Math.round(zone.price * tariff.mult * hours) || 0;
  };

  const handleBook = () => {
    if (!seat) return alert("Будь ласка, оберіть ігрове місце (Крок 3)");
    onRequireAuth();
  };

  return (
    <section id="booking" style={{ padding: '100px 24px', background: 'transparent', position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
      <div style={{ position: 'absolute', top: '100px', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(250,204,21,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 48, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 8, height: 32, background: C.yellow, borderRadius: 4 }} />
          ПАНЕЛЬ БРОНЮВАННЯ
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div>
              <div style={{ color: C.muted, marginBottom: 16, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>1. ОБЕРІТЬ ЗОНУ</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {ZONES.map(z => {
                  const isSelected = zone.id === z.id;
                  return (
                    <button key={z.id} onClick={() => { setZone(z); setSeat(null); }} style={{
                      padding: '20px 16px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      background: isSelected ? 'linear-gradient(145deg, rgba(250,204,21,0.15) 0%, rgba(24,24,27,0.8) 100%)' : 'rgba(24, 24, 27, 0.6)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${isSelected ? C.yellow : C.border}`,
                      boxShadow: isSelected ? '0 4px 20px rgba(250,204,21,0.15)' : 'none',
                      transition: 'all 0.2s', display: 'flex', flexDirection: 'column'
                    }}>
                      <div style={{ color: isSelected ? C.yellow : '#fff', fontWeight: 800, fontSize: 18, marginBottom: 12, lineHeight: 1.3 }}>
                        {z.name}
                        <br />
                        <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, color: isSelected ? C.yellow : C.muted }}>
                          {z.sub ? z.sub : '\u00A0'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto' }}>
                        {z.specs.map(spec => (
                          <span key={spec} style={{ color: C.muted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? C.yellow : C.border, flexShrink: 0 }} /> {spec}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ color: C.muted, marginBottom: 16, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>2. ТАРИФ ТА ЧАС</div>
              
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(24, 24, 27, 0.6)', backdropFilter: 'blur(8px)', padding: 6, borderRadius: 8, border: `1px solid ${C.border}` }}>
                {TARIFFS.map(t => {
                  const isSelected = tariff.id === t.id;
                  return (
                    <button key={t.id} onClick={() => setTariff(t)} style={{
                      flex: 1, padding: '12px 4px', borderRadius: 6, cursor: 'pointer', border: 'none',
                      background: isSelected ? C.yellow : 'transparent',
                      color: isSelected ? '#000' : '#fff', transition: 'all 0.2s'
                    }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 11, opacity: isSelected ? 0.8 : 0.5, marginTop: 2 }}>{t.sub}</div>
                    </button>
                  );
                })}
              </div>

              {tariff.type === 'hourly' && (
                <div style={{ background: 'rgba(24, 24, 27, 0.6)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Тривалість сеансу:</span>
                    <span style={{ color: C.yellow, fontWeight: 800, fontSize: 18 }}>{hours} год.</span>
                  </div>
                  <input 
                    type="range" min="1" max="12" value={hours} onChange={e => setHours(e.target.value)} 
                    className="cyber-slider" style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: C.muted, fontSize: 11, marginTop: 8 }}>
                    <span>1 год</span>
                    <span>12 год</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                <div style={{ color: C.muted, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>3. ВІЛЬНІ МІСЦЯ</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.muted }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: 'rgba(24, 24, 27, 0.6)', border: `1px solid ${C.border}` }}/> Вільно</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: '#1f1f22' }}/> Зайнято</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: C.yellow }}/> Обрано</span>
                </div>
              </div>
              
              <div style={{ background: 'rgba(24, 24, 27, 0.6)', backdropFilter: 'blur(8px)', padding: 32, borderRadius: 8, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: 12 }}>
                  {Array.from({ length: zone.seats }).map((_, i) => {
                    const num = i + 1;
                    const isBooked = zone.booked.includes(num);
                    const isSelected = seat === num;
                    return (
                      <button key={num} disabled={isBooked} onClick={() => setSeat(num)} style={{
                        height: 48, borderRadius: 6, fontWeight: 800, fontSize: 16,
                        background: isBooked ? '#151518' : isSelected ? C.yellow : 'rgba(9, 9, 11, 0.5)',
                        border: `1px solid ${isBooked ? '#1f1f22' : isSelected ? C.yellow : C.border}`,
                        color: isBooked ? '#3f3f46' : isSelected ? '#000' : '#fff',
                        cursor: isBooked ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                        boxShadow: isSelected ? '0 0 15px rgba(250,204,21,0.4)' : 'none'
                      }}>
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          <div style={{ 
            // Панель чеку
            background: 'linear-gradient(180deg, rgba(24,24,27,0.85) 0%, rgba(9,9,11,0.95) 100%)', 
            backdropFilter: 'blur(12px)',
            padding: 40, borderRadius: 12, border: `1px solid ${C.yellow}`, 
            position: 'sticky', top: 120,
            boxShadow: '0 10px 40px rgba(250,204,21,0.08), inset 0 0 20px rgba(250,204,21,0.03)'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 32, letterSpacing: 1 }}>ДЕТАЛІ БРОНЮВАННЯ</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: C.muted, marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>Ігрова зона:</span> 
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, textAlign: 'right' }}>{zone.name} {zone.sub}</span>
              </div>
              
              <div style={{ borderBottom: `1px dashed ${C.border}` }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>Номер ПК:</span> 
                <span style={{ color: seat ? C.yellow : C.muted, fontWeight: 800, fontSize: 16 }}>
                  {seat ? `PC - 0${seat}` : 'Не обрано'}
                </span>
              </div>

              <div style={{ borderBottom: `1px dashed ${C.border}` }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>Обраний тариф:</span> 
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{tariff.name}</span>
              </div>

              {tariff.type === 'hourly' ? (
                <>
                  <div style={{ borderBottom: `1px dashed ${C.border}` }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14 }}>Час гри:</span> 
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{hours} год.</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ borderBottom: `1px dashed ${C.border}` }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14 }}>Формат:</span> 
                    <span style={{ color: C.yellow, fontWeight: 700, fontSize: 14 }}>
                      {tariff.id === 'morning' ? 'РАНКОВИЙ ПАКЕТ' : 'ПАКЕТ НА ВСЮ НІЧ'}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div style={{ borderTop: `2px solid ${C.border}`, paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
              <span style={{ fontSize: 14, color: C.muted, fontWeight: 700, letterSpacing: 1, paddingBottom: 4 }}>ЗАГАЛОМ:</span>
              <span style={{ fontSize: 42, fontWeight: 800, color: C.yellow, lineHeight: 1 }}>{calculateTotal()} ₴</span>
            </div>

            <button onClick={handleBook} style={{ 
              width: '100%', padding: '20px', background: C.yellow, color: '#000', border: 'none', 
              borderRadius: 8, fontSize: 18, fontWeight: 800, cursor: 'pointer', letterSpacing: 2,
              transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(250,204,21,0.2)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(250,204,21,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(250,204,21,0.2)' }}
            >
              ПІДТВЕРДИТИ
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}