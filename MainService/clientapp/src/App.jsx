import { useEffect, useState } from 'react'
import { api, CATEGORY } from './api.js'

function money(v) {
  return `${Number(v).toFixed(2)} ₴/год`
}

function ComputerCard({ computer }) {
  const [devices, setDevices] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next && devices === null) {
      setLoading(true)
      setError(null)
      try {
        setDevices(await api.getDevices(computer.id))
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const cat = CATEGORY[computer.category] ?? `#${computer.category}`

  return (
    <div className="card">
      <div className="card-head">
        <h3>{computer.name}</h3>
        <span className={`badge badge-${cat.toLowerCase()}`}>{cat}</span>
      </div>
      <div className="card-row">
        <span className={computer.isWorking ? 'dot dot-ok' : 'dot dot-bad'} />
        {computer.isWorking ? 'Працює' : 'Не працює'}
      </div>
      <div className="price">{money(computer.pricePerHour)}</div>
      <button className="link" onClick={toggle}>
        {open ? '▲ Сховати пристрої' : '▼ Показати пристрої'}
      </button>
      {open && (
        <div className="devices">
          {loading && <span className="muted">Завантаження…</span>}
          {error && <span className="err">Помилка: {error}</span>}
          {devices && devices.length === 0 && <span className="muted">Пристроїв немає</span>}
          {devices && devices.map((d) => (
            <span key={d.id} className="chip">{d.name}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function PromotionCard({ promo }) {
  const until = new Date(promo.validUntil).toLocaleDateString('uk-UA')
  return (
    <div className="card">
      <div className="card-head">
        <h3>{promo.name}</h3>
        <span className="badge badge-promo">-{promo.discountPercent}%</span>
      </div>
      <p className="desc">{promo.description}</p>
      <div className="muted">Діє до {until}</div>
    </div>
  )
}

function Section({ load, empty, render }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    load()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message))
    return () => { alive = false }
  }, [])

  if (error) return <div className="err">Не вдалося завантажити: {error}</div>
  if (data === null) return <div className="muted">Завантаження…</div>
  if (data.length === 0) return <div className="muted">{empty}</div>
  return <div className="grid">{data.map(render)}</div>
}

export default function App() {
  const [tab, setTab] = useState('computers')

  return (
    <div className="app">
      <header>
        <h1>🎮 PC Club</h1>
        <p className="subtitle">Комп'ютерний клуб — каталог та акції</p>
      </header>

      <nav className="tabs">
        <button className={tab === 'computers' ? 'active' : ''} onClick={() => setTab('computers')}>
          Комп'ютери
        </button>
        <button className={tab === 'promotions' ? 'active' : ''} onClick={() => setTab('promotions')}>
          Акції
        </button>
      </nav>

      <main>
        {tab === 'computers' && (
          <Section
            load={api.getComputers}
            empty="Комп'ютерів ще немає"
            render={(c) => <ComputerCard key={c.id} computer={c} />}
          />
        )}
        {tab === 'promotions' && (
          <Section
            load={api.getPromotions}
            empty="Акцій ще немає"
            render={(p) => <PromotionCard key={p.id} promo={p} />}
          />
        )}
      </main>

      <footer className="muted">PCClubBooking API · .NET 10 + React</footer>
    </div>
  )
}
