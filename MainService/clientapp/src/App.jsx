import { useMemo, useState } from 'react'
import { api, CATEGORY } from './api.js'
import { currentUser, logout } from './auth.js'
import { useAsync } from './ui.jsx'
import AuthModal from './components/AuthModal.jsx'
import BookingModal from './components/BookingModal.jsx'
import MyBookings from './components/MyBookings.jsx'
import AdminPanel from './components/AdminPanel.jsx'

const CAT_META = {
  0: { label: 'Standard', icon: '🖥️', cls: 'standard' },
  1: { label: 'VIP', icon: '👑', cls: 'vip' },
  2: { label: 'PS5', icon: '🎮', cls: 'ps5' },
}
const money = (v) => `${Number(v).toFixed(0)} ₴`

/* ---------- каталог ---------- */

function Devices({ computerId }) {
  const { data, error, loading } = useAsync(() => api.getDevices(computerId), [computerId])
  if (loading) return <span className="muted">Завантаження…</span>
  if (error) return <span className="err">{error}</span>
  if (!data.length) return <span className="muted">Пристроїв немає</span>
  return <div className="devices">{data.map((d) => <span key={d.id} className="chip">🔧 {d.name}</span>)}</div>
}

function ComputerCard({ computer, canBook, onBook }) {
  const [open, setOpen] = useState(false)
  const meta = CAT_META[computer.category] ?? { label: `#${computer.category}`, icon: '💻', cls: 'standard' }
  return (
    <div className={`card pc ${meta.cls}`}>
      <div className="pc-accent" />
      <div className="card-head">
        <div className="pc-title"><span className="pc-icon">{meta.icon}</span><h3>{computer.name}</h3></div>
        <span className={`badge badge-${meta.cls}`}>{meta.label}</span>
      </div>
      <div className={`status ${computer.isWorking ? 'ok' : 'bad'}`}>
        <span className="dot" />{computer.isWorking ? 'Вільний' : 'На ремонті'}
      </div>
      <div className="price-row"><span className="price">{money(computer.pricePerHour)}</span><span className="per">/ година</span></div>
      <div className="card-actions">
        <button className="link" onClick={() => setOpen((v) => !v)}>{open ? '▲ Комплектація' : '▼ Комплектація'}</button>
        {computer.isWorking && (
          <button className="btn primary sm" onClick={() => onBook(computer)}>
            {canBook ? 'Забронювати' : 'Увійти й забронювати'}
          </button>
        )}
      </div>
      {open && <Devices computerId={computer.id} />}
    </div>
  )
}

function Promotions({ items }) {
  if (!items.length) return <div className="empty"><div className="empty-icon">🎁</div>Акцій ще немає</div>
  return (
    <div className="grid">
      {items.map((p) => (
        <div className="card promo" key={p.id}>
          <div className="promo-badge">−{Number(p.discountPercent).toFixed(0)}%</div>
          <h3>{p.name}</h3>
          <p className="desc">{p.description}</p>
          <div className="muted">⏳ Діє до {new Date(p.validUntil).toLocaleDateString('uk-UA')}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------- сторінка ---------- */

export default function App() {
  const [user, setUser] = useState(currentUser())
  const [tab, setTab] = useState('computers')
  const [authOpen, setAuthOpen] = useState(false)
  const [bookingFor, setBookingFor] = useState(null)
  const [filter, setFilter] = useState('all')

  const pcs = useAsync(api.getComputers, [])
  const promos = useAsync(api.getPromotions, [])
  const computers = pcs.data ?? []
  const promotions = promos.data ?? []
  const working = computers.filter((c) => c.isWorking).length
  const computersById = useMemo(() => Object.fromEntries(computers.map((c) => [c.id, c])), [computers])
  const cats = useMemo(() => [...new Set(computers.map((c) => c.category))].sort(), [computers])
  const shownPcs = filter === 'all' ? computers : computers.filter((c) => String(c.category) === filter)

  function onBook(computer) {
    if (!user) { setAuthOpen(true); return }
    setBookingFor(computer)
  }
  function doLogout() { logout(); setUser(null); if (tab === 'admin' || tab === 'my') setTab('computers') }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner hero-row">
          <div>
            <div className="logo">🎮 PC&nbsp;Club</div>
            <p className="subtitle">Комп'ютерний клуб — каталог, бронювання та акції</p>
          </div>
          <div className="auth-box">
            {user ? (
              <>
                <span className="who">👤 {user.name}{user.isAdmin && <span className="admin-tag">admin</span>}</span>
                <button className="btn" onClick={doLogout}>Вийти</button>
              </>
            ) : (
              <button className="btn primary" onClick={() => setAuthOpen(true)}>Увійти</button>
            )}
          </div>
        </div>
      </header>

      <section className="stats">
        <Stat value={pcs.loading ? '—' : computers.length} label="Місць усього" />
        <Stat value={pcs.loading ? '—' : working} label="Вільних зараз" accent="green" />
        <Stat value={pcs.loading ? '—' : cats.length} label="Категорій" />
        <Stat value={promos.loading ? '—' : promotions.length} label="Акцій" accent="accent" />
      </section>

      <nav className="tabs">
        <button className={tab === 'computers' ? 'active' : ''} onClick={() => setTab('computers')}>🖥️ Комп'ютери</button>
        <button className={tab === 'promotions' ? 'active' : ''} onClick={() => setTab('promotions')}>🎁 Акції</button>
        {user && <button className={tab === 'my' ? 'active' : ''} onClick={() => setTab('my')}>📅 Мої броні</button>}
        {user?.isAdmin && <button className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}>⚙️ Адмін</button>}
      </nav>

      <main>
        {tab === 'computers' && (
          pcs.loading ? <div className="muted">Завантаження…</div> :
          pcs.error ? <div className="err">Помилка: {pcs.error}</div> :
          !computers.length ? <div className="empty"><div className="empty-icon">🖥️</div>Комп'ютерів ще немає</div> :
          <>
            <div className="pills">
              <button className={filter === 'all' ? 'pill active' : 'pill'} onClick={() => setFilter('all')}>Усі <span className="pill-count">{computers.length}</span></button>
              {cats.map((c) => {
                const m = CAT_META[c]
                const n = computers.filter((x) => x.category === c).length
                return <button key={c} className={String(c) === filter ? 'pill active' : 'pill'} onClick={() => setFilter(String(c))}>{m?.icon} {m?.label ?? `#${c}`} <span className="pill-count">{n}</span></button>
              })}
            </div>
            <div className="grid">
              {shownPcs.map((c) => <ComputerCard key={c.id} computer={c} canBook={!!user} onBook={onBook} />)}
            </div>
          </>
        )}

        {tab === 'promotions' && (
          promos.loading ? <div className="muted">Завантаження…</div> :
          promos.error ? <div className="err">Помилка: {promos.error}</div> :
          <Promotions items={promotions} />
        )}

        {tab === 'my' && user && <MyBookings computersById={computersById} />}
        {tab === 'admin' && user?.isAdmin && <AdminPanel />}
      </main>

      <footer className="foot">
        <span>PCClubBooking · .NET 10 + React</span>
        <a href="/swagger" target="_blank" rel="noreferrer">API / Swagger ↗</a>
      </footer>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuth={setUser} />}
      {bookingFor && (
        <BookingModal
          computer={bookingFor}
          onClose={() => setBookingFor(null)}
          onBooked={() => { setTab('my') }}
        />
      )}
    </div>
  )
}

function Stat({ value, label, accent }) {
  return (
    <div className="stat">
      <div className={`stat-value ${accent ?? ''}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
