import { useState } from 'react'
import { api, BOOKING_STATUS } from '../api.js'
import { useAsync } from '../ui.jsx'

const fmt = (d) => new Date(d).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export default function MyBookings({ computersById }) {
  const { data, error, loading, reload } = useAsync(api.getMyBookings, [])
  const [busyId, setBusyId] = useState(null)

  async function cancel(id) {
    setBusyId(id)
    try { await api.cancelBooking(id); reload() }
    catch (e) { alert('Не вдалося скасувати: ' + e.message) }
    finally { setBusyId(null) }
  }

  if (loading) return <div className="muted">Завантаження…</div>
  if (error) return <div className="err">Не вдалося завантажити: {error}</div>
  if (!data.length) return <div className="empty"><div className="empty-icon">📅</div>У вас ще немає бронювань</div>

  return (
    <div className="grid">
      {data.map((b) => {
        const st = BOOKING_STATUS[b.status] ?? { label: `#${b.status}`, cls: '' }
        const pc = computersById?.[b.computerId]
        return (
          <div className="card" key={b.id}>
            <div className="card-head">
              <h3>{pc ? pc.name : `Комп'ютер #${b.computerId}`}</h3>
              <span className={`badge status-${st.cls}`}>{st.label}</span>
            </div>
            <div className="muted">🕑 {fmt(b.startTime)} → {fmt(b.endTime)}</div>
            <div className="price-row"><span className="price">{Number(b.totalPrice).toFixed(0)} ₴</span></div>
            {b.status === 0 && (
              <button className="btn danger" disabled={busyId === b.id} onClick={() => cancel(b.id)}>
                {busyId === b.id ? 'Скасування…' : 'Скасувати'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
