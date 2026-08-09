import { useEffect, useMemo, useState } from 'react'
import { api, CATEGORY } from './api.js'

const CAT_META = {
  0: { label: 'Standard', icon: '🖥️', cls: 'standard' },
  1: { label: 'VIP', icon: '👑', cls: 'vip' },
  2: { label: 'PS5', icon: '🎮', cls: 'ps5' },
}

const money = (v) => `${Number(v).toFixed(0)} ₴`

function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    let alive = true
    setState({ data: null, error: null, loading: true })
    fn()
      .then((d) => alive && setState({ data: d, error: null, loading: false }))
      .catch((e) => alive && setState({ data: null, error: e.message, loading: false }))
    return () => { alive = false }
  }, deps)
  return state
}

/* ---------- дрібні шматки ---------- */

function Stat({ value, label, accent }) {
  return (
    <div className="stat">
      <div className={`stat-value ${accent ?? ''}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function Skeleton({ count = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card skeleton" key={i}>
          <div className="sk-line w60" />
          <div className="sk-line w40" />
          <div className="sk-line w80" />
        </div>
      ))}
    </div>
  )
}

function Empty({ icon, text }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div>{text}</div>
    </div>
  )
}

/* ---------- комп'ютери ---------- */

function Devices({ computerId }) {
  const { data, error, loading } = useAsync(() => api.getDevices(computerId), [computerId])
  if (loading) return <span className="muted">Завантаження…</span>
  if (error) return <span className="err">Помилка: {error}</span>
  if (!data.length) return <span className="muted">Пристроїв немає</span>
  return (
    <div className="devices">
      {data.map((d) => <span key={d.id} className="chip">🔧 {d.name}</span>)}
    </div>
  )
}

function ComputerCard({ computer }) {
  const [open, setOpen] = useState(false)
  const meta = CAT_META[computer.category] ?? { label: `#${computer.category}`, icon: '💻', cls: 'standard' }
  return (
    <div className={`card pc ${meta.cls}`}>
      <div className="pc-accent" />
      <div className="card-head">
        <div className="pc-title">
          <span className="pc-icon">{meta.icon}</span>
          <h3>{computer.name}</h3>
        </div>
        <span className={`badge badge-${meta.cls}`}>{meta.label}</span>
      </div>

      <div className={`status ${computer.isWorking ? 'ok' : 'bad'}`}>
        <span className="dot" />
        {computer.isWorking ? 'Вільний' : 'На ремонті'}
      </div>

      <div className="price-row">
        <span className="price">{money(computer.pricePerHour)}</span>
        <span className="per">/ година</span>
      </div>

      <button className="link" onClick={() => setOpen((v) => !v)}>
        {open ? '▲ Сховати комплектацію' : '▼ Комплектація'}
      </button>
      {open && <Devices computerId={computer.id} />}
    </div>
  )
}

function Computers({ computers }) {
  const [filter, setFilter] = useState('all')
  const cats = useMemo(() => {
    const set = new Set(computers.map((c) => c.category))
    return [...set].sort()
  }, [computers])

  const shown = filter === 'all' ? computers : computers.filter((c) => String(c.category) === filter)

  if (!computers.length) return <Empty icon="🖥️" text="Комп'ютерів ще немає" />

  return (
    <>
      <div className="pills">
        <button className={filter === 'all' ? 'pill active' : 'pill'} onClick={() => setFilter('all')}>
          Усі <span className="pill-count">{computers.length}</span>
        </button>
        {cats.map((c) => {
          const m = CAT_META[c]
          const n = computers.filter((x) => x.category === c).length
          return (
            <button
              key={c}
              className={String(c) === filter ? 'pill active' : 'pill'}
              onClick={() => setFilter(String(c))}
            >
              {m?.icon} {m?.label ?? `#${c}`} <span className="pill-count">{n}</span>
            </button>
          )
        })}
      </div>
      <div className="grid">
        {shown.map((c) => <ComputerCard key={c.id} computer={c} />)}
      </div>
    </>
  )
}

/* ---------- акції ---------- */

function Promotions({ promotions }) {
  if (!promotions.length) return <Empty icon="🎁" text="Акцій ще немає" />
  return (
    <div className="grid">
      {promotions.map((p) => {
        const until = new Date(p.validUntil).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
        return (
          <div className="card promo" key={p.id}>
            <div className="promo-badge">−{Number(p.discountPercent).toFixed(0)}%</div>
            <h3>{p.name}</h3>
            <p className="desc">{p.description}</p>
            <div className="muted">⏳ Діє до {until}</div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- сторінка ---------- */

export default function App() {
  const [tab, setTab] = useState('computers')
  const pcs = useAsync(api.getComputers, [])
  const promos = useAsync(api.getPromotions, [])

  const computers = pcs.data ?? []
  const promotions = promos.data ?? []
  const working = computers.filter((c) => c.isWorking).length

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <div className="logo">🎮 PC&nbsp;Club</div>
          <p className="subtitle">Комп'ютерний клуб — каталог місць та акції</p>
        </div>
      </header>

      <section className="stats">
        <Stat value={pcs.loading ? '—' : computers.length} label="Місць усього" />
        <Stat value={pcs.loading ? '—' : working} label="Вільних зараз" accent="green" />
        <Stat value={pcs.loading ? '—' : new Set(computers.map((c) => c.category)).size} label="Категорій" />
        <Stat value={promos.loading ? '—' : promotions.length} label="Акцій" accent="accent" />
      </section>

      <nav className="tabs">
        <button className={tab === 'computers' ? 'active' : ''} onClick={() => setTab('computers')}>
          🖥️ Комп'ютери
        </button>
        <button className={tab === 'promotions' ? 'active' : ''} onClick={() => setTab('promotions')}>
          🎁 Акції
        </button>
      </nav>

      <main>
        {tab === 'computers' && (
          pcs.loading ? <Skeleton /> :
          pcs.error ? <div className="err">Не вдалося завантажити комп'ютери: {pcs.error}</div> :
          <Computers computers={computers} />
        )}
        {tab === 'promotions' && (
          promos.loading ? <Skeleton count={3} /> :
          promos.error ? <div className="err">Не вдалося завантажити акції: {promos.error}</div> :
          <Promotions promotions={promotions} />
        )}
      </main>

      <footer className="foot">
        <span>PCClubBooking · .NET 10 + React</span>
        <a href="/swagger" target="_blank" rel="noreferrer">API / Swagger ↗</a>
      </footer>
    </div>
  )
}
