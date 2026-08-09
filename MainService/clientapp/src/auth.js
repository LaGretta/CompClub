import { AUTH_BASE, authConfigured } from './config.js'

const KEY = 'pcclub_token'

export function getToken() {
  return localStorage.getItem(KEY)
}
function setToken(t) {
  if (t) localStorage.setItem(KEY, t)
  else localStorage.removeItem(KEY)
}

// Розбір payload JWT (лише для UI: ім'я, ролі). Не використовується для безпеки.
function decode(token) {
  const part = token.split('.')[1]
  const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'))
  return JSON.parse(decodeURIComponent(escape(json)))
}

export function currentUser() {
  const t = getToken()
  if (!t) return null
  try {
    const p = decode(t)
    if (p.exp && p.exp * 1000 < Date.now()) { setToken(null); return null }
    let roles = p.role ?? p.roles ?? p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? []
    if (!Array.isArray(roles)) roles = [roles]
    return {
      name: p.unique_name || p.name || p.email || 'Користувач',
      email: p.email ?? '',
      roles,
      isAdmin: roles.includes('Admin'),
    }
  } catch {
    return null
  }
}

async function authPost(path, body) {
  if (!authConfigured) {
    throw new Error('AuthService не налаштований: задай VITE_AUTH_BASE на етапі збірки фронту.')
  }
  const res = await fetch(`${AUTH_BASE}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`
    try { const j = await res.json(); msg = j.detail || j.title || j.message || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export async function login(loginName, password) {
  const data = await authPost('/login', { login: loginName, password })
  setToken(data.accessToken)
  return currentUser()
}

export async function register(userName, email, password, confirmPassword) {
  const data = await authPost('/register', { userName, email, password, confirmPassword })
  setToken(data.accessToken)
  return currentUser()
}

export function logout() {
  setToken(null)
}
