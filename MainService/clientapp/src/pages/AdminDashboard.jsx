import React, { useState } from 'react';

const C = { 
  yellow: '#facc15', 
  green: '#22c55e', 
  red: '#ef4444', 
  muted: '#a1a1aa', 
  surface: '#18181b', 
  bg: '#09090b', 
  border: '#3f3f46' 
};

// Початкові дані комп'ютерів
const INITIAL_PCS = [
  { id: 1, zone: 'STANDARD', name: 'PC-01', status: 'available' },
  { id: 2, zone: 'STANDARD', name: 'PC-02', status: 'occupied', user: 'Alex_CS' },
  { id: 3, zone: 'STANDARD', name: 'PC-03', status: 'available' },
  { id: 4, zone: 'STANDARD', name: 'PC-04', status: 'maintenance' },
  { id: 5, zone: 'PRO', name: 'PC-05', status: 'occupied', user: 'Ghost_Rider' },
  { id: 6, zone: 'PRO', name: 'PC-06', status: 'available' },
  { id: 7, zone: 'PRO', name: 'PC-07', status: 'occupied', user: 'S1mple_Fan' },
  { id: 8, zone: 'VIP', name: 'VIP-01', status: 'occupied', user: 'Navi_Team' },
  { id: 9, zone: 'VIP', name: 'VIP-02', status: 'available' },
];

// Останні бронювання
const INITIAL_BOOKINGS = [
  { id: 'HEX-8921', name: 'Misha D.', club: 'Тернопіль', zone: 'VIP', pc: 'VIP-01', duration: '3 год', total: 600, status: 'Confirmed' },
  { id: 'HEX-8922', name: 'Oleg P.', club: 'Київ', zone: 'PRO', pc: 'PC-05', duration: '2 год', total: 280, status: 'Confirmed' },
  { id: 'HEX-8923', name: 'Roma B.', club: 'Тернопіль', zone: 'STANDARD', pc: 'PC-02', duration: '5 год (Ніч)', total: 400, status: 'Pending' },
];

export default function AdminDashboard() {
  const [pcs, setPcs] = useState(INITIAL_PCS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState('pcs'); // 'pcs' | 'bookings'

  // Зміна статусу ПК по кліку
  const togglePcStatus = (id) => {
    setPcs(pcs.map(pc => {
      if (pc.id === id) {
        const nextStatus = pc.status === 'available' ? 'occupied' : pc.status === 'occupied' ? 'maintenance' : 'available';
        return { ...pc, status: nextStatus, user: nextStatus === 'occupied' ? 'Admin_Guest' : null };
      }
      return pc;
    }));
  };

  // Підтвердження / Скасування бронювання
  const updateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  // Розрахунок статистики
  const totalRevenue = bookings.filter(b => b.status === 'Confirmed').reduce((acc, b) => acc + b.total, 0);
  const occupiedCount = pcs.filter(p => p.status === 'occupied').length;
  const loadPercentage = Math.round((occupiedCount / pcs.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: '#fff', padding: '120px 24px 40px', fontFamily: 'sans-serif' }}>      
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Хедер Адмінки */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottom: `1px solid ${C.border}`, paddingBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: 1, margin: 0 }}>
              HEXAGON <span style={{ color: C.yellow }}>ADMIN PANEL</span>
            </h1>
            <p style={{ color: C.muted, margin: '4px 0 0 0', fontSize: 14 }}>Система управління клубами та ПК у реальному часі</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ padding: '8px 16px', background: 'rgba(34, 197, 94, 0.1)', border: `1px solid ${C.green}`, color: C.green, borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
              ● SERVER ONLINE
            </span>
          </div>
        </div>

        {/* Метрики / Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div style={{ background: C.surface, padding: 24, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>ВИРУЧКА ЗА ДЕНЬ</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.yellow, marginTop: 8 }}>{totalRevenue} ₴</div>
          </div>
          <div style={{ background: C.surface, padding: 24, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>ЗАВАНТАЖЕНІСТЬ ПК</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 8 }}>{loadPercentage}% <span style={{ fontSize: 16, color: C.muted, fontWeight: 400 }}>({occupiedCount}/{pcs.length})</span></div>
          </div>
          <div style={{ background: C.surface, padding: 24, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>АКТИВНІ БРОНІ</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.green, marginTop: 8 }}>{bookings.length}</div>
          </div>
        </div>

        {/* Перемикач вкладок */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <button 
            onClick={() => setActiveTab('pcs')}
            style={{
              padding: '12px 24px', background: activeTab === 'pcs' ? C.yellow : C.surface, color: activeTab === 'pcs' ? '#000' : '#fff',
              border: `1px solid ${activeTab === 'pcs' ? C.yellow : C.border}`, borderRadius: 8, fontWeight: 800, cursor: 'pointer'
            }}
          >
            🖥 УПРАВЛІННЯ ПК
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 24px', background: activeTab === 'bookings' ? C.yellow : C.surface, color: activeTab === 'bookings' ? '#000' : '#fff',
              border: `1px solid ${activeTab === 'bookings' ? C.yellow : C.border}`, borderRadius: 8, fontWeight: 800, cursor: 'pointer'
            }}
          >
            📋 СПИСОК БРОНЮВАНЬ
          </button>
        </div>

        {/* Моніторинг ПК */}
        {activeTab === 'pcs' && (
          <div style={{ background: C.surface, padding: 32, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Клікайте на ПК, щоб змінити статус:</h3>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.muted }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: C.green, borderRadius: 2 }}/> Вільний</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: C.red, borderRadius: 2 }}/> Зайнятий</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: C.yellow, borderRadius: 2 }}/> Сервіс</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {pcs.map(pc => {
                const statusBg = pc.status === 'available' ? 'rgba(34, 197, 94, 0.1)' : pc.status === 'occupied' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(250, 204, 21, 0.1)';
                const statusBorder = pc.status === 'available' ? C.green : pc.status === 'occupied' ? C.red : C.yellow;
                
                return (
                  <div 
                    key={pc.id} 
                    onClick={() => togglePcStatus(pc.id)}
                    style={{
                      background: statusBg, border: `1px solid ${statusBorder}`, padding: 20, borderRadius: 10, cursor: 'pointer',
                      transition: 'transform 0.15s ease', textAlign: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>{pc.zone}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, margin: '8px 0', color: '#fff' }}>{pc.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: statusBorder, textTransform: 'uppercase' }}>
                      {pc.status === 'available' ? 'Вільний' : pc.status === 'occupied' ? (pc.user || 'Зайнятий') : 'Сервіс'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Таблиця Бронювань */}
        {activeTab === 'bookings' && (
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#121214', borderBottom: `1px solid ${C.border}`, color: C.muted }}>
                  <th style={{ padding: 16 }}>ID</th>
                  <th style={{ padding: 16 }}>Клієнт</th>
                  <th style={{ padding: 16 }}>Клуб</th>
                  <th style={{ padding: 16 }}>Зона / ПК</th>
                  <th style={{ padding: 16 }}>Сума</th>
                  <th style={{ padding: 16 }}>Статус</th>
                  <th style={{ padding: 16 }}>Дії</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: 16, fontWeight: 800, color: C.yellow }}>{b.id}</td>
                    <td style={{ padding: 16, fontWeight: 600 }}>{b.name}</td>
                    <td style={{ padding: 16, color: C.muted }}>{b.club}</td>
                    <td style={{ padding: 16 }}>{b.zone} ({b.pc})</td>
                    <td style={{ padding: 16, fontWeight: 800 }}>{b.total} ₴</td>
                    <td style={{ padding: 16 }}>
                      <span style={{
                        padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 800,
                        background: b.status === 'Confirmed' ? 'rgba(34, 197, 94, 0.2)' : b.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(250, 204, 21, 0.2)',
                        color: b.status === 'Confirmed' ? C.green : b.status === 'Cancelled' ? C.red : C.yellow
                      }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: 16 }}>
                      {b.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => updateBookingStatus(b.id, 'Confirmed')} style={{ background: C.green, border: 'none', color: '#000', fontWeight: 800, padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>✓</button>
                          <button onClick={() => updateBookingStatus(b.id, 'Cancelled')} style={{ background: C.red, border: 'none', color: '#fff', fontWeight: 800, padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>✕</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}