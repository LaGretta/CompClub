import { useMemo, useState } from 'react'
import { Modal, Field } from '../ui.jsx'
import { api } from '../api.js'

// локальний datetime -> ISO
function toIso(local) {
  return local ? new Date(local).toISOString() : null
}

function defaultRange() {
  const start = new Date()
  start.setMinutes(0, 0, 0)
  start.setHours(start.getHours() + 1)
  const end = new Date(start)
  end.setHours(end.getHours() + 2)
  const fmt = (d) => {
    const off = d.getTimezoneOffset()
    const local = new Date(d.getTime() - off * 60000)
    return local.toISOString().slice(0, 16)
  }
  return { start: fmt(start), end: fmt(end) }
}

export default function BookingModal({ computer, onClose, onBooked }) {
  const init = useMemo(defaultRange, [])
  const [start, setStart] = useState(init.start)
  const [end, setEnd] = useState(init.end)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const hours = useMemo(() => {
    const s = new Date(start), e = new Date(end)
    const h = (e - s) / 3600000
    return h > 0 ? h : 0
  }, [start, end])
  const total = (hours * Number(computer.pricePerHour)).toFixed(0)

  async function submit(e) {
    e.preventDefault()
    if (hours <= 0) { setError('Кінець має бути пізніше за початок'); return }
    setBusy(true)
    setError(null)
    try {
      await api.createBooking({ computerId: computer.id, startTime: toIso(start), endTime: toIso(end) })
      onBooked()
      onClose()
    } catch (err) {
      setError(err.status === 401 ? 'Потрібно увійти' : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title={`Бронювання — ${computer.name}`} onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Початок" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
        <Field label="Кінець" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
        <div className="sum">
          <span>{hours > 0 ? `${hours} год × ${Number(computer.pricePerHour).toFixed(0)} ₴` : 'Оберіть інтервал'}</span>
          <strong>{hours > 0 ? `${total} ₴` : '—'}</strong>
        </div>
        {error && <div className="err">{error}</div>}
        <button className="btn primary wide" type="submit" disabled={busy}>
          {busy ? 'Бронюємо…' : 'Забронювати'}
        </button>
      </form>
    </Modal>
  )
}
