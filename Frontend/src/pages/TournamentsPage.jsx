import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

const C = { yellow: '#facc15', muted: '#a1a1aa', border: '#3f3f46', bg: '#09090b', surface: '#121214' };

const TOURNAMENTS = [
  {
    id: 1, game: 'CS 2', name: 'TERNOPIL MASTERS CUP 2026', 
    date: '18.07', time: '12:00', prize: '25 000 ₴', 
    format: '5 vs 5 (LAN)', teamSize: '5x5', fee: 'Пакет Ніч / День', bracket: 'Double Elimination', 
    image: '/cs2.jpg',
    first: '12 000 ₴', second: '8 000 ₴', third: '5 000 ₴'
  },
  {
    id: 2, game: 'DOTA 2', name: 'THE BATTLE OF RIFT', 
    date: '07.06', time: '18:00', prize: '15 000 ₴', 
    format: '5 vs 5 (LAN)', teamSize: '5x5', fee: 'Пакет День', bracket: 'Single Elimination', 
    image: '/dota2.png',
    first: '8 000 ₴', second: '4 000 ₴', third: '3 000 ₴'
  },
  {
    id: 3, game: 'VALORANT', name: 'RADIANT STRIKE TERNOPIL', 
    date: '30.07', time: '11:00', prize: '12 000 ₴', 
    format: '5 vs 5 (LAN)', teamSize: '5x5', fee: 'Пакет День', bracket: 'Double Elimination', 
    image: '/valorant.jpg',
    first: '6 000 ₴', second: '4 000 ₴', third: '2 000 ₴'
  },
  {
    id: 4, game: 'WORLD OF TANKS', name: 'STEEL FIST TOURNAMENT', 
    date: '15.08', time: '15:00', prize: '10 000 ₴', 
    format: '3 vs 3 (LAN)', teamSize: '3x3', fee: 'Оплата за години', bracket: 'Round Robin', 
    image: '/wot.jpg',
    first: '5 000 ₴', second: '3 000 ₴', third: '2 000 ₴'
  },
  {
    id: 5, game: 'WAR THUNDER', name: 'ACES OF THE SKY', 
    date: '15.08', time: '14:00', prize: '8 000 ₴', 
    format: 'Сетапи (LAN)', teamSize: 'Взвод', fee: 'Оплата за години', bracket: 'Swiss System', 
    image: '/warthunder.jpg',
    first: '4 000 ₴', second: '2 500 ₴', third: '1 500 ₴'
  },
  {
    id: 6, game: 'LEAGUE OF LEGENDS', name: 'SUMMONERS RIFT SHOWDOWN', 
    date: '30.07', time: '10:00', prize: '14 000 ₴', 
    format: '5 vs 5 (LAN)', teamSize: '5x5', fee: 'Пакет День', bracket: 'Single Elimination', 
    image: '/lol.jpg',
    first: '7 000 ₴', second: '4 500 ₴', third: '2 500 ₴'
  }
];

const DISCIPLINES = [
  { name: 'CS 2 5X5 MIX', logo: '/logo-cs2.jpg' },
  { name: 'DOTA 2 5X5 MIX', logo: '/logo-dota2.png' },
  { name: 'VALORANT 5X5 MIX', logo: '/logo-valorant.jpg' },
  { name: 'WORLD OF TANKS 3X3', logo: '/logo-wot.jpg' },
  { name: 'WAR THUNDER', logo: '/logo-wt.png' },
  { name: 'LEAGUE OF LEGENDS', logo: '/logo-lol.png' }
];

// Список турнірів
const TournamentsList = ({ onSelect }) => (
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
              
              <div style={{ 
                width: 40, 
                height: 40, 
                background: 'rgba(250, 204, 21, 0.05)', 
                borderRadius: 8, 
                border: `1px solid rgba(250, 204, 21, 0.2)`,
                overflow: 'hidden'
              }}>
                <img 
                  src={item.logo} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
              </div>
              
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </Reveal>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {TOURNAMENTS.map((t, index) => (
        <Reveal key={t.id} delay={index * 100} direction="up">
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            background: 'rgba(9, 9, 11, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: 12, 
            overflow: 'hidden', 
            border: `1px solid ${C.border}`, 
            alignItems: 'center', 
            transition: 'transform 0.2s', 
            cursor: 'pointer' 
          }} 
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} 
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            
            <div style={{ 
              width: '300px', 
              minHeight: '160px', 
              backgroundImage: `linear-gradient(to right, rgba(9, 9, 11, 0.1) 0%, rgba(9, 9, 11, 0.95) 100%), url(${t.image})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative', 
              padding: '24px 24px 44px 24px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              flexShrink: 0 
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
              <div style={{ color: C.yellow, fontSize: 13, fontWeight: 600 }}>Призовий фонд</div>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{t.prize}</div>
            </div>
            
            <div style={{ padding: 32 }}>
              <button onClick={() => onSelect(t)} style={{ background: C.yellow, color: '#000', border: 'none', padding: '14px 32px', fontSize: 14, fontWeight: 800, borderRadius: 999, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 15px rgba(250, 204, 21, 0.3)' }} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
                ПЕРЕГЛЯНУТИ
              </button>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
);

// Детальний перегляд турніру
const TournamentDetail = ({ tournament, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 24px 60px', 
          borderBottom: `1px solid ${C.border}`,
          marginTop: '-70px'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: '40px' }}>
            <h1 style={{ fontSize: 'clamp(60px, 10vw, 120px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>{tournament.game}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 32, color: '#fff', fontWeight: 500, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{tournament.date}</span>
              <span style={{ fontSize: 32, color: '#fff', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{tournament.teamSize}</span>
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
                  { title: 'Дисципліна та формат', val: tournament.format, icon: '🎮' },
                  { title: 'Дата та час', val: `${tournament.date}.2026, ${tournament.time}`, icon: '🕒' },
                  { title: 'Розмір команди', val: tournament.teamSize, icon: '👥' },
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
                <button style={{ background: C.yellow, color: '#000', border: 'none', padding: '20px 48px', fontSize: 16, fontWeight: 900, borderRadius: 999, cursor: 'pointer', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(250,204,21,0.4)', transition: 'transform 0.2s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
                  ПОСИЛАННЯ НА ТУРНІР {tournament.name}
                </button>
              </div>
            </Reveal>

            <Reveal delay={400} direction="up">
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#fff', fontSize: 32, fontWeight: 900, textTransform: 'uppercase', marginBottom: 40 }}>ПЕРЕМОЖЦІ</h3>
                
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
              <p>1. Усі матчі проходять на базі кіберклубу на акаунтах FACEIT / Riot Games гравців.</p>
              <p>2. Використання будь-якого стороннього ПЗ, скриптів або макросів карається моментальною дискваліфікацією команди без повернення внеску.</p>
              <p>3. Запізнення команди більше ніж на 15 хвилин від старту сітки призводить до технічної поразки.</p>
              <p>4. Учасники зобов'язані поводитися адекватно. Образи супротивників чи адміністрації призводять до штрафних санкцій.</p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default function TournamentsPage() {
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTournament]);

  return (
    <main style={{ paddingTop: '80px', background: 'transparent', minHeight: '100vh' }}>
      <div key={selectedTournament ? selectedTournament.id : 'list'}>
        {!selectedTournament ? (
          <TournamentsList onSelect={setSelectedTournament} />
        ) : (
          <TournamentDetail tournament={selectedTournament} onBack={() => setSelectedTournament(null)} />
        )}
      </div>
      <Footer />
    </main>
  );
}