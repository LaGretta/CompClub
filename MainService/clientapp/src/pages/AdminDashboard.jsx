import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { tournamentsApi } from '../services/api'; 

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b', surface: '#121214', surfaceLight: '#18181b' };

const GAME_PRESETS = {
  "CS 2": { bg: "/cs2.jpg", logo: "/logo-cs2.jpg" },
  "Dota 2": { bg: "/dota2.png", logo: "/logo-dota2.png" },
  "Valorant": { bg: "/valorant.jpg", logo: "/logo-valorant.jpg" },
  "World of Tanks": { bg: "/wot.jpg", logo: "/logo-wot.jpg" },
  "War Thunder": { bg: "/warthunder.jpg", logo: "/logo-wt.png" },
  "League of Legends": { bg: "/lol.jpg", logo: "/logo-lol.png" }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('tournaments');

  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTourney, setNewTourney] = useState({ title: '', game: 'CS 2', date: '', prize: '', format: '5X5 MIX' });

  useEffect(() => {
    fetchTournaments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);
    try {
      const data = await tournamentsApi.getAll();
      setTournaments(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error(error);
      showToast('Не вдалося завантажити список турнірів', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!newTourney.title || !newTourney.date || !newTourney.prize) {
      showToast('Заповніть всі поля!', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await tournamentsApi.create(newTourney);
      showToast('Турнір успішно створено!', 'success');
      
      setIsModalOpen(false);
      setNewTourney({ title: '', game: 'CS 2', date: '', prize: '', format: '5X5 MIX' });
      
      fetchTournaments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTournament = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей турнір?")) return;
    try {
      await tournamentsApi.delete(id);
      setTournaments(tournaments.filter(t => t.id !== id));
      showToast('Турнір видалено', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: '#fff', fontFamily: "'Rajdhani', sans-serif" }}>
      
      {/*Бокове меню*/}
      <aside style={{ width: '280px', background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', paddingTop: '40px', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 10 }}>
        <div style={{ padding: '0 24px 32px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: C.yellow, letterSpacing: '2px', textTransform: 'uppercase' }}>Панель керування</span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px', letterSpacing: '1px' }}>АДМІНІСТРАТОР</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
          {[
            { id: 'dashboard', icon: '📊', name: 'Статистика (В розробці)' },
            { id: 'computers', icon: '🖥', name: 'Комп\'ютери (В розробці)' },
            { id: 'bookings', icon: '📅', name: 'Бронювання (В розробці)' },
            { id: 'tournaments', icon: '🏆', name: 'Турніри' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '8px',
                background: activeTab === tab.id ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                color: activeTab === tab.id ? C.yellow : C.muted,
                border: `1px solid ${activeTab === tab.id ? 'rgba(250, 204, 21, 0.3)' : 'transparent'}`,
                fontWeight: 800, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
              }}
              onMouseEnter={e => { if(activeTab !== tab.id) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if(activeTab !== tab.id) e.currentTarget.style.color = C.muted }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span> {tab.name}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '24px' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: `1px solid ${C.border}`, borderRadius: '8px', fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>
            ⬅ Повернутися на сайт
          </button>
        </div>
      </aside>

      {/*Головна зона*/}
      <main style={{ marginLeft: '260px', flex: 1, padding: '40px 48px 60px' }}>
        
        {activeTab === 'tournaments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '16px', margin: 0 }}>
                <span style={{ width: '8px', height: '32px', background: C.yellow, borderRadius: '4px' }}></span>
                КЕРУВАННЯ ТУРНІРАМИ
              </h1>
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ padding: '14px 28px', background: C.yellow, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 900, fontSize: '15px', letterSpacing: '1px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(250, 204, 21, 0.3)', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                + ДОДАТИ ТУРНІР
              </button>
            </div>

            {isLoading ? (
              <p style={{ color: C.muted, fontSize: '18px' }}>Завантаження турнірів з сервера...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {tournaments.length === 0 ? (
                  <p style={{ color: C.muted }}>Турнірів ще немає. Додайте перший!</p>
                ) : (
                  tournaments.map(t => (
                    <div key={t.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                      <div style={{ height: '160px', backgroundColor: '#18181b', backgroundImage: GAME_PRESETS[t.game] ? `url(${GAME_PRESETS[t.game].bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #121214 0%, transparent 100%)' }}></div>
                        
                        {GAME_PRESETS[t.game] && (
                          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(9, 9, 11, 0.8)', padding: '6px 16px 6px 6px', borderRadius: '10px', border: `1px solid ${C.border}`, backdropFilter: 'blur(4px)' }}>
                            <img src={GAME_PRESETS[t.game].logo} alt={t.game} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
                              {t.game}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '24px', fontWeight: 800 }}>{t.title}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: C.muted, fontSize: '15px', marginBottom: '32px' }}>
                          <span style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${C.border}`, paddingBottom: '8px' }}>Дата: <strong style={{ color: '#fff' }}>{t.date}</strong></span>
                          <span style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${C.border}`, paddingBottom: '8px' }}>Призові: <strong style={{ color: C.yellow }}>{t.prize}</strong></span>
                          <span style={{ display: 'flex', justifyContent: 'space-between' }}>Формат: <strong style={{ color: '#fff' }}>{t.format}</strong></span>
                        </div>
                        <button onClick={() => handleDeleteTournament(t.id)} style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '1px' }} onMouseEnter={e => { e.target.style.background = 'rgba(239, 68, 68, 0.15)'; e.target.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)' }} onMouseLeave={e => { e.target.style.background = 'rgba(239, 68, 68, 0.05)'; e.target.style.boxShadow = 'none' }}>
                          ВИДАЛИТИ ТУРНІР
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab !== 'tournaments' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: C.muted, flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '48px' }}>🛠</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Цей розділ ще в розробці</h2>
            <p style={{ margin: 0 }}>Тут скоро з'явиться керування даними.</p>
          </div>
        )}
      </main>

      {/* МОДАЛКА СТВОРЕННЯ ТУРНІРУ */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: C.surfaceLight, border: `1px solid ${C.yellow}`, borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
            
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: C.muted, fontSize: '24px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: 900, color: '#fff' }}>ДОДАТИ ТУРНІР</h2>

            <form onSubmit={handleCreateTournament} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ height: '140px', borderRadius: '8px', backgroundColor: '#18181b', backgroundImage: GAME_PRESETS[newTourney.game] ? `url(${GAME_PRESETS[newTourney.game].bg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '8px', border: `1px solid ${C.border}`, position: 'relative' }}>
                {GAME_PRESETS[newTourney.game] && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(9, 9, 11, 0.8)', padding: '6px 12px 6px 6px', borderRadius: '8px', border: `1px solid ${C.border}`, backdropFilter: 'blur(4px)' }}>
                    <img src={GAME_PRESETS[newTourney.game].logo} alt={newTourney.game} style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>{newTourney.game}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.muted, marginBottom: '8px' }}>ОБЕРІТЬ ГРУ</label>
                <select 
                  value={newTourney.game} 
                  onChange={e => setNewTourney({...newTourney, game: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: C.bg, border: `1px solid ${C.border}`, color: '#fff', borderRadius: '6px', fontSize: '15px', outline: 'none' }}
                >
                  {Object.keys(GAME_PRESETS).map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.muted, marginBottom: '8px' }}>НАЗВА ТУРНІРУ</label>
                <input type="text" placeholder="напр. Осінній кубок Тернополя" value={newTourney.title} onChange={e => setNewTourney({...newTourney, title: e.target.value})} style={{ width: '100%', padding: '12px', background: C.bg, border: `1px solid ${C.border}`, color: '#fff', borderRadius: '6px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.muted, marginBottom: '8px' }}>ДАТА ПРОВЕДЕННЯ</label>
                  <input type="date" value={newTourney.date} onChange={e => setNewTourney({...newTourney, date: e.target.value})} style={{ width: '100%', padding: '12px', background: C.bg, border: `1px solid ${C.border}`, color: '#fff', borderRadius: '6px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.muted, marginBottom: '8px' }}>ФОРМАТ</label>
                  <select value={newTourney.format} onChange={e => setNewTourney({...newTourney, format: e.target.value})} style={{ width: '100%', padding: '12px', background: C.bg, border: `1px solid ${C.border}`, color: '#fff', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                    <option value="5X5 MIX">5X5 MIX</option>
                    <option value="5X5 TEAM">5X5 (Командний)</option>
                    <option value="3X3">3X3</option>
                    <option value="2X2">2X2 (Дуо)</option>
                    <option value="1X1">1v1 (Соло)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.muted, marginBottom: '8px' }}>ПРИЗОВИЙ ФОНД</label>
                <input type="text" placeholder="напр. 15 000 ₴ + Гаджети" value={newTourney.prize} onChange={e => setNewTourney({...newTourney, prize: e.target.value})} style={{ width: '100%', padding: '12px', background: C.bg, border: `1px solid ${C.border}`, color: '#fff', borderRadius: '6px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <button disabled={isSubmitting} type="submit" style={{ width: '100%', padding: '16px', marginTop: '16px', background: C.yellow, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 900, fontSize: '16px', letterSpacing: '1px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'transform 0.2s' }} onMouseEnter={e => { if(!isSubmitting) e.target.style.transform = 'translateY(-2px)'}} onMouseLeave={e => { if(!isSubmitting) e.target.style.transform = 'translateY(0)'}}>
                {isSubmitting ? 'ОБРОБКА...' : 'СТВОРИТИ ТУРНІР'}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}