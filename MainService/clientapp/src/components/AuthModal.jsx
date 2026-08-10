import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const C = { yellow: '#facc15', muted: '#a1a1aa', surface: '#18181b', bg: '#09090b', border: '#3f3f46' };

// Авторизацію (login/register) видає AuthService — задай його URL через VITE_AUTH_BASE,
// напр. https://auth-production.up.railway.app/api. Дефолт /api — той самий домен.
const API_BASE_URL = import.meta.env.VITE_AUTH_BASE || '/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const { login } = useContext(AuthContext);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Стан для відображення пароля

  // Поля форм
  const [loginInput, setLoginInput] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Базові перевірки
    if (isLoginTab) {
      if (!loginInput || !password) {
        setError("Будь ласка, заповніть всі поля!");
        return;
      }
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setError("Будь ласка, заповніть всі поля!");
        return;
      }
      if (password !== confirmPassword) {
        setError("Паролі не співпадають!");
        return;
      }
    }

    setLoading(true);
   
    try {
      if (isLoginTab) {
        // Запит на вхід
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login: loginInput,
            password: password
          }),
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();

          // Оновлюємо ГЛОБАЛЬНИЙ стан: зберігаємо токен + isAuthenticated=true.
          // Без цього Navbar/BookingMap (які читають AuthContext) лишались у стані "гість".
          login(data.accessToken, loginInput);
          onLoginSuccess?.({ name: loginInput, token: data.accessToken });

          setLoading(false);
          onClose();
        } else {
          const errData = await response.json().catch(() => ({}));
          setError(errData.message || 'Невірний логін або пароль.');
          setLoading(false);
        }

      } else {
        // Запит на реєстрацію
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword
          }),
          credentials: 'include'
        });

        if (response.ok) {
          alert('Реєстрація успішна! Тепер увійдіть під своїми даними.');
          setIsLoginTab(true);
          setPassword('');
          setConfirmPassword('');
        } else {
          const errData = await response.json().catch(() => ({}));
          setError(errData.message || 'Помилка реєстрації. Спробуйте інший логін/email.');
        }
        setLoading(false);
      }

    } catch (err) {
      console.error('Помилка мережі:', err);
      // Якщо бекенд ще не запущений, виводимо зрозумілу помилку
      if (err.message === 'Failed to fetch') {
        setError('Сервер недоступний. Можливо, бекенд зараз вимкнений.');
      } else {
        setError('Не вдалося зʼєднатися з сервером.');
      }
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', background: C.bg, border: `1px solid ${C.border}`, 
    borderRadius: 6, color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, border: `1px solid ${C.yellow}`, borderRadius: 12,
        width: '100%', maxWidth: '420px', padding: '40px 32px', position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(250,204,21,0.05)'
      }}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20, background: 'none', border: 'none',
          color: C.muted, fontSize: 22, cursor: 'pointer', transition: 'color 0.2s'
        }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = C.muted}>
          ✕
        </button>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 12px', borderRadius: 6, marginBottom: 20, fontSize: 13, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 24, marginBottom: 32, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
          <button type="button" onClick={() => { setIsLoginTab(true); setError(''); }} style={{
            background: 'none', border: 'none', color: isLoginTab ? C.yellow : C.muted,
            fontSize: 20, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s',
            position: 'relative', padding: '0 4px'
          }}>
            ВХІД
            {isLoginTab && <span style={{ position: 'absolute', bottom: -14, left: 0, right: 0, height: 2, background: C.yellow }} />}
          </button>
          <button type="button" onClick={() => { setIsLoginTab(false); setError(''); }} style={{
            background: 'none', border: 'none', color: !isLoginTab ? C.yellow : C.muted,
            fontSize: 20, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s',
            position: 'relative', padding: '0 4px'
          }}>
            РЕЄСТРАЦІЯ
            {!isLoginTab && <span style={{ position: 'absolute', bottom: -14, left: 0, right: 0, height: 2, background: C.yellow }} />}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {!isLoginTab && (
            <>
              <div>
                <label style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>НІКНЕЙМ (USERNAME)</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Введіть ваш нікнейм" style={inputStyle} onFocus={e => e.target.style.borderColor = C.yellow} onBlur={e => e.target.style.borderColor = C.border} />
              </div>

              <div>
                <label style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>EMAIL</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@club.com" style={inputStyle} onFocus={e => e.target.style.borderColor = C.yellow} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
            </>
          )}

          {isLoginTab && (
            <div>
              <label style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>ЛОГІН АБО EMAIL</label>
              <input type="text" value={loginInput} onChange={e => setLoginInput(e.target.value)} placeholder="Ваш логін" style={inputStyle} onFocus={e => e.target.style.borderColor = C.yellow} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <label style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>ПАРОЛЬ</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '90px' }} onFocus={e => e.target.style.borderColor = C.yellow} onBlur={e => e.target.style.borderColor = C.border} />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ 
                position: 'absolute', right: 12, top: 35, 
                background: 'none', border: 'none', color: C.yellow, 
                cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: 1,
                padding: '4px'
              }}
            >
              {showPassword ? "СХОВАТИ" : "ПОКАЗАТИ"}
            </button>
          </div>

          {!isLoginTab && (
            <div style={{ position: 'relative' }}>
              <label style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>ПІДТВЕРДИТИ ПАРОЛЬ</label>
              <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '90px' }} onFocus={e => e.target.style.borderColor = C.yellow} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '16px', background: C.yellow, color: '#000', border: 'none', borderRadius: 6,
            fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 2, marginTop: 12, transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1
          }} onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}>
            {loading ? 'ЗАВАНТАЖЕННЯ...' : (isLoginTab ? 'УВІЙТИ В АКАУНТ' : 'СТВОРИТИ ПРОФІЛЬ')}
          </button>

        </form>
      </div>
    </div>
  );
}
