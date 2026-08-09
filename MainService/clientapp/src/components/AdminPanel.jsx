import { useState } from 'react'
import { api, CATEGORY, CATEGORY_LIST, BOOKING_STATUS } from '../api.js'
import { useAsync, Modal, Field, Select } from '../ui.jsx'

/* ---------- Комп'ютери ---------- */

function ComputerForm({ initial, onClose, onSaved }) {
  const editing = !!initial
  const [f, setF] = useState(initial ?? { name: '', pricePerHour: 50, category: 0, isWorking: true })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  async function save(e) {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      if (editing) await api.updateComputer(initial.id, { name: f.name, isWorking: f.isWorking, pricePerHour: Number(f.pricePerHour) })
      else await api.createComputer({ name: f.name, pricePerHour: Number(f.pricePerHour), category: Number(f.category) })
      onSaved(); onClose()
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return (
    <Modal title={editing ? `Редагувати ${initial.name}` : "Новий комп'ютер"} onClose={onClose}>
      <form onSubmit={save}>
        <Field label="Назва" value={f.name} onChange={(e) => set('name', e.target.value)} required />
        <Field label="Ціна / год" type="number" min="0" step="1" value={f.pricePerHour} onChange={(e) => set('pricePerHour', e.target.value)} required />
        {editing
          ? <label className="check"><input type="checkbox" checked={f.isWorking} onChange={(e) => set('isWorking', e.target.checked)} /> Працює</label>
          : <Select label="Категорія" value={f.category} onChange={(e) => set('category', e.target.value)} options={CATEGORY_LIST} />}
        {error && <div className="err">{error}</div>}
        <button className="btn primary wide" disabled={busy}>{busy ? 'Збереження…' : 'Зберегти'}</button>
      </form>
    </Modal>
  )
}

function DevicesModal({ computer, onClose }) {
  const { data, error, loading, reload } = useAsync(() => api.getDevices(computer.id), [computer.id])
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  async function add(e) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try { await api.addDevice(computer.id, { name, computerId: computer.id }); setName(''); reload() }
    catch (err) { alert(err.message) } finally { setBusy(false) }
  }
  async function del(id) {
    try { await api.deleteDevice(id); reload() } catch (err) { alert(err.message) }
  }

  return (
    <Modal title={`Пристрої — ${computer.name}`} onClose={onClose}>
      <form onSubmit={add} className="row-form">
        <input placeholder="Назва пристрою" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn primary" disabled={busy}>Додати</button>
      </form>
      {loading && <div className="muted">Завантаження…</div>}
      {error && <div className="err">{error}</div>}
      {data && data.map((d) => (
        <div className="list-row" key={d.id}>
          <span>🔧 {d.name}</span>
          <button className="btn danger sm" onClick={() => del(d.id)}>✕</button>
        </div>
      ))}
      {data && !data.length && <div className="muted">Пристроїв немає</div>}
    </Modal>
  )
}

function ComputersAdmin() {
  const { data, error, loading, reload } = useAsync(api.getComputers, [])
  const [form, setForm] = useState(null)      // {} = new, {..} = edit
  const [devicesOf, setDevicesOf] = useState(null)

  async function del(c) {
    if (!confirm(`Видалити «${c.name}»?`)) return
    try { await api.deleteComputer(c.id); reload() } catch (e) { alert(e.message) }
  }

  return (
    <>
      <div className="admin-bar">
        <button className="btn primary" onClick={() => setForm({})}>+ Додати комп'ютер</button>
      </div>
      {loading && <div className="muted">Завантаження…</div>}
      {error && <div className="err">{error}</div>}
      {data && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Назва</th><th>Категорія</th><th>Ціна</th><th>Статус</th><th></th></tr></thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{CATEGORY[c.category] ?? c.category}</td>
                  <td>{Number(c.pricePerHour).toFixed(0)} ₴</td>
                  <td className={c.isWorking ? 'ok-text' : 'bad-text'}>{c.isWorking ? 'Працює' : 'Ремонт'}</td>
                  <td className="actions">
                    <button className="btn sm" onClick={() => setDevicesOf(c)}>Пристрої</button>
                    <button className="btn sm" onClick={() => setForm(c)}>✎</button>
                    <button className="btn danger sm" onClick={() => del(c)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {form && <ComputerForm initial={form.id ? form : null} onClose={() => setForm(null)} onSaved={reload} />}
      {devicesOf && <DevicesModal computer={devicesOf} onClose={() => setDevicesOf(null)} />}
    </>
  )
}

/* ---------- Акції ---------- */

function PromotionForm({ initial, onClose, onSaved }) {
  const editing = !!initial
  const [f, setF] = useState(initial
    ? { ...initial, validUntil: initial.validUntil.slice(0, 10) }
    : { name: '', description: '', discountPercent: 10, validUntil: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  async function save(e) {
    e.preventDefault()
    setBusy(true); setError(null)
    const dto = {
      name: f.name, description: f.description,
      discountPercent: Number(f.discountPercent),
      validUntil: new Date(f.validUntil).toISOString(),
    }
    try {
      if (editing) await api.updatePromotion(initial.id, dto)
      else await api.createPromotion(dto)
      onSaved(); onClose()
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return (
    <Modal title={editing ? `Редагувати ${initial.name}` : 'Нова акція'} onClose={onClose}>
      <form onSubmit={save}>
        <Field label="Назва" value={f.name} onChange={(e) => set('name', e.target.value)} required />
        <Field label="Опис" value={f.description} onChange={(e) => set('description', e.target.value)} />
        <Field label="Знижка %" type="number" min="0" max="100" value={f.discountPercent} onChange={(e) => set('discountPercent', e.target.value)} required />
        <Field label="Діє до" type="date" value={f.validUntil} onChange={(e) => set('validUntil', e.target.value)} required />
        {error && <div className="err">{error}</div>}
        <button className="btn primary wide" disabled={busy}>{busy ? 'Збереження…' : 'Зберегти'}</button>
      </form>
    </Modal>
  )
}

function PromotionsAdmin() {
  const { data, error, loading, reload } = useAsync(api.getPromotions, [])
  const [form, setForm] = useState(null)

  async function del(p) {
    if (!confirm(`Видалити «${p.name}»?`)) return
    try { await api.deletePromotion(p.id); reload() } catch (e) { alert(e.message) }
  }

  return (
    <>
      <div className="admin-bar"><button className="btn primary" onClick={() => setForm({})}>+ Додати акцію</button></div>
      {loading && <div className="muted">Завантаження…</div>}
      {error && <div className="err">{error}</div>}
      {data && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Назва</th><th>Знижка</th><th>Діє до</th><th></th></tr></thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>−{Number(p.discountPercent).toFixed(0)}%</td>
                  <td>{new Date(p.validUntil).toLocaleDateString('uk-UA')}</td>
                  <td className="actions">
                    <button className="btn sm" onClick={() => setForm(p)}>✎</button>
                    <button className="btn danger sm" onClick={() => del(p)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {form && <PromotionForm initial={form.id ? form : null} onClose={() => setForm(null)} onSaved={reload} />}
    </>
  )
}

/* ---------- Усі бронювання ---------- */

function BookingsAdmin() {
  const [page, setPage] = useState(1)
  const { data, error, loading } = useAsync(() => api.getAllBookings(page, 20), [page])
  const fmt = (d) => new Date(d).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  if (loading) return <div className="muted">Завантаження…</div>
  if (error) return <div className="err">{error}</div>

  const items = data.items ?? data
  return (
    <>
      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>User</th><th>ПК</th><th>Час</th><th>Сума</th><th>Статус</th></tr></thead>
          <tbody>
            {items.map((b) => {
              const st = BOOKING_STATUS[b.status] ?? { label: b.status }
              return (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.userId}</td>
                  <td>{b.computerId}</td>
                  <td>{fmt(b.startTime)} → {fmt(b.endTime)}</td>
                  <td>{Number(b.totalPrice).toFixed(0)} ₴</td>
                  <td>{st.label}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {data.totalPages > 1 && (
        <div className="pager">
          <button className="btn sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Назад</button>
          <span className="muted">Сторінка {data.page} / {data.totalPages}</span>
          <button className="btn sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Далі →</button>
        </div>
      )}
    </>
  )
}

/* ---------- обгортка ---------- */

export default function AdminPanel() {
  const [tab, setTab] = useState('computers')
  return (
    <div>
      <div className="subtabs">
        <button className={tab === 'computers' ? 'active' : ''} onClick={() => setTab('computers')}>Комп'ютери</button>
        <button className={tab === 'promotions' ? 'active' : ''} onClick={() => setTab('promotions')}>Акції</button>
        <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>Бронювання</button>
      </div>
      {tab === 'computers' && <ComputersAdmin />}
      {tab === 'promotions' && <PromotionsAdmin />}
      {tab === 'bookings' && <BookingsAdmin />}
    </div>
  )
}
