import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingsApi, computersApi } from '../services/api';

const C = { yellow: '#facc15', muted: '#a1a1aa', surface: '#18181b', bg: '#09090b', border: '#3f3f46' };

const CATEGORY_META = {
  0: { name: 'СТАНДАРТ', sub: '', specs: ['RTX 5060 Ti', '144Hz IPS'] },
  1: { name: 'VIP', sub: 'BOOTCAMP', specs: ['RTX 5080', '360Hz OLED'] },
  2: { name: 'PS5', sub: 'CONSOLE', specs: ['PlayStation 5', '4K 120Hz'] },
};

const TARIFFS = [
  { id: 'morning', name: 'Ранковий', sub: '08:00-14:00', type: 'fixed', mult: 6 },
  { id: 'standard', name: 'Стандарт', sub: 'Погодинно', type: 'hourly' },
  { id: 'night', name: 'Нічний', sub: '22:00-08:00', type: 'fixed', mult: 10 },
];

export default function BookingMap({ onRequireAuth }) {
  const { isAuthenticated } = useContext(AuthContext);

  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [activeCat, setActiveCat] = useState(null);
  const [tariff, setTariff] = useState(TARIFFS[1]);
  const [hours, setHours] = useState(2);
  const [selected, setSelected] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    computersApi.getAll()
      .then((data) => { if (alive) setComputers(Array.isArray(data) ? data : []); })
      .catch((e) => { if (alive) setLoadError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(computers.map((c) => c.category))].sort((a, b) => a - b),
    [computers]
  );

  useEffect(() => {
    if (activeCat === null && categories.length) setActiveCat(categories[0]);
  }, [categories, activeCat]);

  const zoneComputers = useMemo(
    () => computers.filter((c) => c.category === activeCat),
    [computers, activeCat]
  );

  const calculateTotal = () => {
    if (!selected) return 0;
    const price = Number(selected.pricePerHour) || 0;
    if (tariff.type === 'fixed') return Math.round(price * tariff.mult);
    return Math.round(price * Number(hours));
  };

  const handleBook = async () => {
    if (!selected) return alert('Оберіть комп’ютер (Крок 3)');
    if (!isAuthenticated) { onRequireAuth?.(); return; }

    setIsSubmitting(true);
    try {
      let startTime = new Date();
      let endTime = new Date();

      if (tariff.id === 'standard') {
        endTime.setHours(startTime.getHours() + Number(hours));
      } else if (tariff.id === 'morning') {
        startTime.setHours(8, 0, 0, 0);
        if (startTime < new Date()) startTime.setDate(startTime.getDate() + 1);
        endTime = new Date(startTime);
        endTime.setHours(14, 0, 0, 0);
      } else if (tariff.id === 'night') {
        startTime.setHours(22, 0, 0, 0);
        if (startTime < new Date()) startTime.setDate(startTime.getDate() + 1);
        endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + 1);
        endTime.setHours(8, 0, 0, 0);
      }

      await bookingsApi.create(selected.id, startTime, endTime);
      alert('🎉 Успішно заброньовано! Деталі — у профілі.');
      setSelected(null);
    } catch (error) {
      alert(`Помилка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const meta = CATEGORY_META[activeCat] ?? { name: `#${activeCat}`, sub: '', specs: [] };

  return (
    <section id="booking" style={{ padding: '100px 24px', background: 'transparent', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 48, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 8, height: 32, background: C.yellow, borderRadius: 4 }} />
          ПАНЕЛЬ БРОНЮВАННЯ
        </h2>

        {loading ? (
          <p style={{ color: C.muted }}>Завантаження комп’ютерів…</p>
        ) : loadError ? (
          <p style={{ color: '#ef4444' }}>Не вдалося завантажити каталог: {loadError}</p>
        ) : !computers.length ? (
          <p style={{ color: C.muted }}>Комп’ютерів поки немає.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              
              <div>
                <div style={{ color: C.muted, marginBottom: 16, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>1. ОБЕРІТЬ ЗОНУ</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                  {categories.map((cat) => {
                    const m = CATEGORY_META[cat] ?? { name: `#${cat}`, sub: '', specs: [] };
                    const isSelected = activeCat === cat;
                    const from = Math.min(...computers.filter((c) => c.category === cat).map((c) => Number(c.pricePerHour)));
                    return (
                      <button key={cat} onClick={() => { setActiveCat(cat); setSelected(null); }} style={{
                        padding: '20px 16px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                        background: isSelected ? 'linear-gradient(145deg, rgba(250,204,21,0.15) 0%, rgba(24,24,27,0.8) 100%)' : 'rgba(24, 24, 27, 0.6)',
                        border: `1px solid ${isSelected ? C.yellow : C.border}`, transition: 'all 0.2s', display: 'flex', flexDirection: 'column'
                      }}>
                        <div style={{ color: isSelected ? C.yellow : '#fff', fontWeight: 800, fontSize: 18, marginBottom: 12, lineHeight: 1.3 }}>
                          {m.name}<br />
                          <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, color: isSelected ? C.yellow : C.muted }}>{m.sub || ' '}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto' }}>
                          {m.specs.map((spec) => (
                            <span key={spec} style={{ color: C.muted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? C.yellow : C.border, flexShrink: 0 }} /> {spec}
                            </span>
                          ))}
                          <span style={{ color: isSelected ? C.yellow : C.muted, fontSize: 12, marginTop: 4 }}>від {Number.isFinite(from) ? from : 0} ₴/год</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ color: C.muted, marginBottom: 16, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>2. ТАРИФ ТА ЧАС</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(24, 24, 27, 0.6)', padding: 6, borderRadius: 8, border: `1px solid ${C.border}` }}>
                  {TARIFFS.map((t) => {
                    const isSelected = tariff.id === t.id;
                    return (
                      <button key={t.id} onClick={() => setTariff(t)} style={{
                        flex: 1, padding: '12px 4px', borderRadius: 6, cursor: 'pointer', border: 'none',
                        background: isSelected ? C.yellow : 'transparent', color: isSelected ? '#000' : '#fff', transition: 'all 0.2s'
                      }}>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{t.name}</div>
                        <div style={{ fontSize: 11, opacity: isSelected ? 0.8 : 0.5, marginTop: 2 }}>{t.sub}</div>
                      </button>
                    );
                  })}
                </div>
                {tariff.type === 'hourly' && (
                  <div style={{ background: 'rgba(24, 24, 27, 0.6)', padding: '24px', borderRadius: 8, border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Тривалість сеансу:</span>
                      <span style={{ color: C.yellow, fontWeight: 800, fontSize: 18 }}>{hours} год.</span>
                    </div>
                    <input type="range" min="1" max="12" value={hours} onChange={(e) => setHours(e.target.value)} className="cyber-slider" style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: C.muted, fontSize: 11, marginTop: 8 }}>
                      <span>1 год</span><span>12 год</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                  <div style={{ color: C.muted, fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>3. ОБЕРІТЬ КОМП’ЮТЕР</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.muted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: 'rgba(24, 24, 27, 0.6)', border: `1px solid ${C.border}` }} /> Вільно</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: '#1f1f22' }} /> Ремонт</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: C.yellow }} /> Обрано</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(24, 24, 27, 0.6)', padding: 24, borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                    {zoneComputers.map((pc) => {
                      const isSelected = selected?.id === pc.id;
                      const down = !pc.isWorking;
                      return (
                        <button key={pc.id} disabled={down} onClick={() => setSelected(pc)} style={{
                          padding: '14px 12px', borderRadius: 6, fontWeight: 700, fontSize: 14, textAlign: 'left',
                          background: down ? '#151518' : isSelected ? C.yellow : 'rgba(9, 9, 11, 0.5)',
                          border: `1px solid ${down ? '#1f1f22' : isSelected ? C.yellow : C.border}`,
                          color: down ? '#3f3f46' : isSelected ? '#000' : '#fff',
                          cursor: down ? 'not-allowed' : 'pointer', transition: 'all 0.15s'
                        }}>
                          <div style={{ fontWeight: 800 }}>{pc.name}</div>
                          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{down ? 'на ремонті' : `${Number(pc.pricePerHour)} ₴/год`}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(180deg, rgba(24,24,27,0.85) 0%, rgba(9,9,11,0.95) 100%)', padding: 40, borderRadius: 12, border: `1px solid ${C.yellow}`, position: 'sticky', top: 120 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 32, letterSpacing: 1 }}>ДЕТАЛІ БРОНЮВАННЯ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: C.muted, marginBottom: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>Зона:</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, textAlign: 'right' }}>{meta.name} {meta.sub}</span>
                </div>
                <div style={{ borderBottom: `1px dashed ${C.border}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>Комп’ютер:</span>
                  <span style={{ color: selected ? C.yellow : C.muted, fontWeight: 800, fontSize: 16 }}>{selected ? selected.name : 'Не обрано'}</span>
                </div>
                <div style={{ borderBottom: `1px dashed ${C.border}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>Тариф:</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{tariff.name}</span>
                </div>
                {tariff.type === 'hourly' && (
                  <>
                    <div style={{ borderBottom: `1px dashed ${C.border}` }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14 }}>Час гри:</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{hours} год.</span>
                    </div>
                  </>
                )}
              </div>
              <div style={{ borderTop: `2px solid ${C.border}`, paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                <span style={{ fontSize: 14, color: C.muted, fontWeight: 700, letterSpacing: 1, paddingBottom: 4 }}>ЗАГАЛОМ:</span>
                <span style={{ fontSize: 42, fontWeight: 800, color: C.yellow, lineHeight: 1 }}>{calculateTotal()} ₴</span>
              </div>
              <button disabled={isSubmitting} onClick={handleBook} style={{
                width: '100%', padding: '20px', background: C.yellow, color: '#000', border: 'none',
                borderRadius: 8, fontSize: 18, fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                letterSpacing: 2, transition: 'all 0.2s', opacity: isSubmitting ? 0.7 : 1
              }}>
                {isSubmitting ? 'ОБРОБКА...' : isAuthenticated ? 'ПІДТВЕРДИТИ' : 'УВІЙТИ Й ЗАБРОНЮВАТИ'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}