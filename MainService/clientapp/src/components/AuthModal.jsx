import { useState } from 'react'
import { Modal, Field } from '../ui.jsx'
import { login, register } from '../auth.js'
import { authConfigured } from '../config.js'

export default function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ login: '', email: '', password: '', confirmPassword: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const user = mode === 'login'
        ? await login(form.login, form.password)
        : await register(form.login, form.email, form.password, form.confirmPassword)
      onAuth(user)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title={mode === 'login' ? 'Вхід' : 'Реєстрація'} onClose={onClose}>
      {!authConfigured && (
        <div className="notice">
          AuthService поки не підключений. Логін запрацює, коли фронт зберуть зі змінною
          <code> VITE_AUTH_BASE</code> (URL сервісу авторизації).
        </div>
      )}
      <div className="switch">
        <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Вхід</button>
        <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Реєстрація</button>
      </div>
      <form onSubmit={submit}>
        <Field label={mode === 'login' ? 'Логін' : "Ім'я користувача"} value={form.login} onChange={set('login')} required autoFocus />
        {mode === 'register' && (
          <Field label="Email" type="email" value={form.email} onChange={set('email')} required />
        )}
        <Field label="Пароль" type="password" value={form.password} onChange={set('password')} required />
        {mode === 'register' && (
          <Field label="Повтор пароля" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
        )}
        {error && <div className="err">{error}</div>}
        <button className="btn primary wide" type="submit" disabled={busy}>
          {busy ? 'Зачекайте…' : mode === 'login' ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>
    </Modal>
  )
}
