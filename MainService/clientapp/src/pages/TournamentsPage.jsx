import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { tournamentsApi } from '../services/api';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b', surface: '#121214', surfaceLight: '#18181b' };

const GAME_PRESETS = {
  "CS 2": { bg: "/cs2.jpg", logo: "/logo-cs2.jpg" },
  "Dota 2": { bg: "/dota2.png", logo: "/logo-dota2.png" },
  "Valorant": { bg: "/valorant.jpg", logo: "/logo-valorant.jpg" },
  "World of Tanks": { bg: "/wot.jpg", logo: "/logo-wot.jpg" },
  "War Thunder": { bg: "/warthunder.jpg", logo: "/logo-wt.png" },
  "League of Legends": { bg: "/lol.jpg", logo: "/logo-lol.png" }
};

const DISCIPLINES = [
  { name: 'CS 2 5X5 MIX', logo: '/logo-cs2.jpg' },
  { name: 'DOTA 2 5X5 MIX', logo: '/logo-dota2.png' },
  { name: 'VALORANT 5X5 MIX', logo: '/logo-valorant.jpg' },
  { name: 'WORLD OF TANKS 3X3', logo: '/logo-wot.jpg' },
  { name: 'WAR THUNDER', logo: '/logo-wt.png' },
  { name: 'LEAGUE OF LEGENDS', logo: '/logo-lol.png' }
];

// === СПИСОК ТУРНІРІВ ===
const TournamentsList = ({ tournaments, isLoading, onSelect }) => (
  <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
    <Reveal direction="down">
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: C.yellow, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 40 }}>
          СПИСОК ДИСЦИПЛІН
        </h2>
        
        {/*Лого ігор*/}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px 40px', textAlign: 'left', maxWidth: 800, margin: '0 auto', marginBottom: 40 }}>
          {DISCIPLINES.map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(250, 204, 21, 0.05)', borderRadius: 8, border: `1px solid rgba(250, 204, 21, 0.2)`, overflow: 'hidden' }}>
                <img src={item.logo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </Reveal>

    {isLoading ? (
      <div style={{ textAlign: 'center', padding: '40px', color: C.muted, fontSize: '18px' }}>
        Завантаження списку турнірів...
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {tournaments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: C.surface, borderRadius: '12px', border: `1px dashed ${C.border}`, color: C.muted }}>
            Наразі активних турнірів немає. Слідкуй за анонсами!
          </div>
        ) : (
          tournaments.map((t, index) => (
            <Reveal key={t.id} delay={index * 100} direction="up">
              <div style={{ 
                display: 'flex', flexWrap: 'wrap', background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, alignItems: 'center', transition: 'transform 0.2s', cursor: 'pointer' 
              }} 
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} 
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                
                <div style={{ 
                  width: '300px', minHeight: '160px', 
                  backgroundImage: `linear-gradient(to right, rgba(9, 9, 11, 0.1) 0%, rgba(9, 9, 11, 0.95) 100%), url(${t.image})`, 
                  backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', 
                  padding: '24px 24px 44px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 
                }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: 1.5, lineHeight: 1.1, marginBottom: 4, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{t.game}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{t.prize}</div>
                  <div style={{ position: 'absolute', bottom: 14, left: 24, background: C.yellow, color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                    Призовий фонд
                  </div>
                </div>
                
                <div style={{ padding: '24px 32px', flexGrow: 1 }}>
                  <div style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>{t.date}, {t.time}</div>
                  <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>{t.name}</div>
                  <div style={{ color: C.yellow, fontSize: 13, fontWeight: 600 }}>Формат</div>
                  <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{t.format}</div>
                </div>
                
                <div style={{ padding: 32 }}>
                  <button onClick={() => onSelect(t)} style={{ background: C.yellow, color: '#000', border: 'none', padding: '14px 32px', fontSize: 14, fontWeight: 800, borderRadius: 999, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 15px rgba(250, 204, 21, 0.3)' }} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
                    ПЕРЕГЛЯНУТИ
                  </button>
                </div>
              </div>
            </Reveal>
          ))
        )}
      </div>
    )}
  </div>
);

// === ДЕТАЛЬНИЙ ПЕРЕГЛЯД ТА РЕЄСТРАЦІЯ ===
const TournamentDetail = ({ tournament, onBack }) => {
  const { isAuthenticated, userName } = useContext(AuthContext);
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Стан для реєстрації
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teammates, setTeammates] = useState([]);
  
  // Перевірка, чи юзер вже зареєстрований
  const [isRegistered, setIsRegistered] = useState(() => {
    const regs = JSON.parse(localStorage.getItem(`registered_tourneys_${userName}`)) || [];
    return regs.includes(tournament.id);
  });

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      showToast('Щоб взяти участь, спочатку увійдіть в акаунт!', 'error');
      return;
    }

    // Визначаємо кількість тіммейтів по формату (напр. "5X5 MIX" -> 4 тіммейти)
    let matesCount = 0;
    const formatStr = tournament.format?.toUpperCase() || '';
    if (formatStr.includes('5')) matesCount = 4;
    else if (formatStr.includes('3')) matesCount = 2;
    else if (formatStr.includes('2')) matesCount = 1;

    setTeammates(Array(matesCount).fill(''));
    setTeamName('');
    setIsModalOpen(true);
  };

  const handleTeammateChange = (index, value) => {
    const newMates = [...teammates];
    newMates[index] = value;
    setTeammates(newMates);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (teammates.length > 0 && !teamName.trim()) {
      showToast('Введіть назву команди!', 'error');
      return;
    }
    if (teammates.some(mate => !mate.trim())) {
      showToast('Заповніть нікнейми всіх учасників команди!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        captain: userName,
        teamName: teamName || userName, // Якщо турнір 1х1, назва команди - це нік
        teammates: teammates
      };

      await tournamentsApi.register(tournament.id, payload);
      
      // Зберігаємо локально, щоб змінити кнопку на "Зареєстровано"
      const regs = JSON.parse(localStorage.getItem(`registered_tourneys_${userName}`)) || [];
      regs.push(tournament.id);
      localStorage.setItem(`registered_tourneys_${userName}`, JSON.stringify(regs));
      
      setIsRegistered(true);
      setIsModalOpen(false);
      showToast(`Ви успішно зареєструвалися на турнір ${tournament.name}!`, 'success');
    } catch (error) {
      showToast(error.message, 'error'); // Бекенд скаже, якщо юзер вже має команду
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px', position: 'relative', zIndex: 10 }}>
        <Reveal direction="right">
          <button onClick={onBack} style={{ background: 'rgba(9, 9, 11, 0.6)', backdropFilter: 'blur(5px)', color: '#fff', border: `1px solid ${C.border}`, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.borderColor = C.yellow} onMouseLeave={e => e.target.style.borderColor = C.border}>
            ← Назад до списку
          </button>
        </Reveal>
      </div>

      <Reveal direction="down">
        {/* Шапка з великою обкладинкою гри */}
        <div style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.2) 0%, rgba(9, 9, 11, 0.95) 100%), url(${tournament.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center', padding: '80px 24px 60px', borderBottom: `1px solid ${C.border}`, marginTop: '-70px'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: '40px' }}>
            <h1 style={{ fontSize: 'clamp(60px, 10vw, 120px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>{tournament.game}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 32, color: '#fff', fontWeight: 500, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{tournament.date}</span>
              <span style={{ fontSize: 32, color: '#fff', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{tournament.format}</span>
              <span style={{ fontSize: 40, color: C.yellow, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{tournament.prize}</span>
            </div>
          </div>
        </div>
      </Reveal>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        
        <Reveal delay={100} direction="up">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
            <button onClick={() => setActiveTab('overview')} style={{ background: activeTab === 'overview' ? C.yellow : 'rgba(9, 9, 11, 0.7)', backdropFilter: activeTab === 'overview' ? 'none' : 'blur(10px)', color: activeTab === 'overview' ? '#000' : '#fff', padding: '12px 32px', borderRadius: 999, border: activeTab === 'overview' ? '1px solid transparent' : `1px solid ${C.border}`, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>Огляд</button>
            <button onClick={() => setActiveTab('rules')} style={{ background: activeTab === 'rules' ? C.yellow : 'rgba(9, 9, 11, 0.7)', backdropFilter: activeTab === 'rules' ? 'none' : 'blur(10px)', color: activeTab === 'rules' ? '#000' : '#fff', padding: '12px 32px', borderRadius: 999, border: activeTab === 'rules' ? '1px solid transparent' : `1px solid ${C.border}`, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>Регламент</button>
          </div>
        </Reveal>

        {activeTab === 'overview' && (
          <>
            <Reveal delay={200} direction="up">
              <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginBottom: 60, overflowX: 'auto', paddingBottom: 8 }}>
                {[
                  { title: 'Дисципліна', val: tournament.game, icon: '🎮' },
                  { title: 'Дата та час', val: `${tournament.date}, ${tournament.time}`, icon: '🕒' },
                  { title: 'Формат', val: tournament.format, icon: '👥' },
                  { title: 'Вступний внесок', val: tournament.fee, icon: '🎟' },
                  { title: 'Формат сітки', val: tournament.bracket, icon: '🏆' }
                ].map((pill, i) => (
                  <div key={i} style={{ border: `1px solid rgba(250, 204, 21, 0.3)`, borderRadius: 999, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(10px)', flex: 1, minWidth: 'max-content' }}>
                    <div style={{ fontSize: 24 }}>{pill.icon}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>{pill.title}</span>
                      <span style={{ color: C.muted, fontSize: 11 }}>{pill.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={300} direction="up">
              <div style={{ textAlign: 'center', marginBottom: 100 }}>
                <button 
                  onClick={handleOpenModal} 
                  disabled={isRegistered}
                  style={{ 
                    background: isRegistered ? 'rgba(250, 204, 21, 0.1)' : C.yellow, 
                    color: isRegistered ? C.yellow : '#000', 
                    border: isRegistered ? `1px solid ${C.yellow}` : 'none', 
                    padding: '20px 48px', fontSize: 16, fontWeight: 900, borderRadius: 999, 
                    cursor: isRegistered ? 'not-allowed' : 'pointer', textTransform: 'uppercase', 
                    boxShadow: isRegistered ? 'none' : '0 0 20px rgba(250,204,21,0.4)', transition: 'transform 0.2s' 
                  }} 
                  onMouseEnter={e => { if(!isRegistered) e.target.style.transform = 'scale(1.05)' }} 
                  onMouseLeave={e => { if(!isRegistered) e.target.style.transform = 'scale(1)' }}
                >
                  {isRegistered ? '✅ ВИ ЗАРЕЄСТРОВАНІ' : 'ВЗЯТИ УЧАСТЬ В ТУРНІРІ'}
                </button>
              </div>
            </Reveal>

            <Reveal delay={400} direction="up">
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#fff', fontSize: 32, fontWeight: 900, textTransform: 'uppercase', marginBottom: 40 }}>ПРИЗОВИЙ ФОНД</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ order: 1, border: `3px solid rgba(250, 204, 21, 0.5)`, padding: 24, width: 220, height: 280, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(9, 9, 11, 0.6)', backdropFilter: 'blur(12px)' }}>
                     <div style={{ fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1 }}>2</div>
                     <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 30 }}>місце</div>
                     <div style={{ color: C.yellow, fontSize: 12, fontWeight: 800 }}>призовий</div>
                     <div style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>{tournament.second}</div>
                  </div>

                  <div style={{ order: 2, border: `3px solid ${C.yellow}`, padding: 24, width: 260, height: 340, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 0 40px rgba(250,204,21,0.2)' }}>
                     <div style={{ fontSize: 80, fontWeight: 900, color: '#fff', lineHeight: 1 }}>1</div>
                     <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 40 }}>місце</div>
                     <div style={{ color: C.yellow, fontSize: 14, fontWeight: 800 }}>призовий</div>
                     <div style={{ color: '#fff', fontSize: 24, fontWeight: 900 }}>{tournament.first}</div>
                  </div>

                  <div style={{ order: 3, border: `3px solid rgba(250, 204, 21, 0.3)`, padding: 24, width: 200, height: 260, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(9, 9, 11, 0.6)', backdropFilter: 'blur(12px)' }}>
                     <div style={{ fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 1 }}>3</div>
                     <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20 }}>місце</div>
                     <div style={{ color: C.yellow, fontSize: 12, fontWeight: 800 }}>призовий</div>
                     <div style={{ color: '#fff', fontSize: 18, fontWeight: 900 }}>{tournament.third}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </>
        )}

        {activeTab === 'rules' && (
          <Reveal delay={200} direction="up">
            <div style={{ color: '#e4e4e7', lineHeight: 1.8, fontSize: 16, background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(12px)', padding: 40, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <h3 style={{ color: '#fff', marginBottom: 20, fontSize: 24, fontWeight: 800 }}>Регламент турніру</h3>
              <p>1. Один гравець може перебувати лише в одній команді на конкретному турнірі.</p>
              <p>2. Усі матчі проходять на базі кіберклубу на акаунтах FACEIT / Riot Games гравців.</p>
              <p>3. Використання будь-якого стороннього ПЗ, скриптів або макросів карається моментальною дискваліфікацією команди без повернення внеску.</p>
              <p>4. Запізнення команди більше ніж на 15 хвилин від старту сітки призводить до технічної поразки.</p>
              <p>5. Учасники зобов'язані поводитися адекватно. Образи супротивників чи адміністрації призводять до штрафних санкцій.</p>
            </div>
          </Reveal>
        )}
      </div>

      {/* МОДАЛЬНЕ ВІКНО РЕЄСТРАЦІЇ */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: C.surfaceLight, border: `1px solid ${C.yellow}`, borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: C.muted, fontSize: '24px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>РЕЄСТРАЦІЯ НА ТУРНІР</h2>
            <p style={{ color: C.yellow, fontWeight: 700, marginBottom: '24px' }}>{tournament.name}</p>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Поля для командного формату */}
              {teammates.length > 0 ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.muted, marginBottom: '8px' }}>НАЗВА КОМАНДИ</label>
                    <input type="text" placeholder="напр. Natus Vincere" value={teamName} onChange={e => setTeamName(e.target.value)} style={{ width: '100%', padding: '14px', background: C.bg, border: `1px solid ${C.border}`, color: '#fff', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ background: 'rgba(250, 204, 21, 0.05)', border: `1px dashed ${C.yellow}`, padding: '16px', borderRadius: '8px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.yellow, marginBottom: '8px' }}>КАПІТАН (ЦЕ ВИ)</label>
                    <input type="text" value={userName || 'Гравець'} disabled style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '15px', opacity: 0.7, boxSizing: 'border-box', cursor: 'not-allowed' }} />
                  </div>

                  {teammates.map((mate, index) => (
                    <div key={index}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.muted, marginBottom: '8px' }}>ГРАВЕЦЬ {index + 2} (НІКНЕЙМ)</label>
                      <input type="text" placeholder={`Нікнейм тіммейта #${index + 2}`} value={mate} onChange={e => handleTeammateChange(index, e.target.value)} style={{ width: '100%', padding: '14px', background: C.bg, border: `1px solid ${C.border}`, color: '#fff', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </>
              ) : (
                // Поле для формату 1х1
                <div style={{ background: 'rgba(250, 204, 21, 0.05)', border: `1px dashed ${C.yellow}`, padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>⚔️</span>
                  <h4 style={{ margin: '0 0 8px', color: '#fff', fontSize: '18px' }}>Соло турнір (1v1)</h4>
                  <p style={{ margin: 0, color: C.muted, fontSize: '14px' }}>Ви будете зареєстровані під своїм поточним нікнеймом: <strong style={{ color: C.yellow }}>{userName}</strong>.</p>
                </div>
              )}

              <button disabled={isSubmitting} type="submit" style={{ width: '100%', padding: '18px', marginTop: '16px', background: C.yellow, color: '#000', border: 'none', borderRadius: '8px', fontWeight: 900, fontSize: '16px', letterSpacing: '1px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'transform 0.2s' }} onMouseEnter={e => { if(!isSubmitting) e.target.style.transform = 'translateY(-2px)'}} onMouseLeave={e => { if(!isSubmitting) e.target.style.transform = 'translateY(0)'}}>
                {isSubmitting ? 'ОБРОБКА...' : 'ПІДТВЕРДИТИ РЕЄСТРАЦІЮ'}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await tournamentsApi.getAll();
        
        // Збагачуємо дані з API локальними картинками та додатковими полями для красивого UI
        const mappedData = data.map(t => ({
          ...t,
          name: t.title, // В API це title, у нас name
          image: GAME_PRESETS[t.game]?.bg || '/cs2.jpg',
          time: '12:00', // Дефолтний час, якщо бекенд не віддає
          fee: 'За тарифами клубу',
          bracket: 'Single Elimination',
          first: t.prize, // Увесь приз за перше місце, або можна розбити
          second: 'Гаджети',
          third: 'Промокоди'
        }));
        
        setTournaments(mappedData.sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error("Не вдалося завантажити турніри", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTournament]);

  return (
    <main style={{ paddingTop: '80px', background: 'transparent', minHeight: '100vh' }}>
      <div key={selectedTournament ? selectedTournament.id : 'list'}>
        {!selectedTournament ? (
          <TournamentsList tournaments={tournaments} isLoading={isLoading} onSelect={setSelectedTournament} />
        ) : (
          <TournamentDetail tournament={selectedTournament} onBack={() => setSelectedTournament(null)} />
        )}
      </div>
      <Footer />
    </main>
  );
}