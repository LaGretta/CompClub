import { API_BASE } from './config.js'
import { getToken } from './auth.js'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function req(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) throw new ApiError('Потрібно увійти', 401)
  if (res.status === 403) throw new ApiError('Недостатньо прав', 403)
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`
    try { const j = await res.json(); msg = j.detail || j.title || j.message || msg } catch {}
    throw new ApiError(msg, res.status)
  }
  if (res.status === 204) return null
  const txt = await res.text()
  return txt ? JSON.parse(txt) : null
}

export const api = {
  // ---- публічні ----
  getComputers: () => req('/api/computers'),
  getComputer: (id) => req(`/api/computers/${id}`),
  getAvailable: (start, end) => req(`/api/computers/available?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`),
  getDevices: (computerId) => req(`/api/computers/${computerId}/devices`),
  getPromotions: () => req('/api/promotions'),
  getPromotion: (id) => req(`/api/promotions/${id}`),

  // ---- бронювання (авторизований користувач) ----
  createBooking: (dto) => req('/api/bookings', { method: 'POST', body: dto, auth: true }),
  getMyBookings: () => req('/api/bookings/my', { auth: true }),
  getBooking: (id) => req(`/api/bookings/${id}`, { auth: true }),
  cancelBooking: (id) => req(`/api/bookings/${id}/cancel`, { method: 'POST', auth: true }),

  // ---- admin ----
  getAllBookings: (page = 1, pageSize = 20) => req(`/api/bookings?page=${page}&pageSize=${pageSize}`, { auth: true }),
  createComputer: (dto) => req('/api/computers', { method: 'POST', body: dto, auth: true }),
  updateComputer: (id, dto) => req(`/api/computers/${id}`, { method: 'PUT', body: dto, auth: true }),
  deleteComputer: (id) => req(`/api/computers/${id}`, { method: 'DELETE', auth: true }),
  addDevice: (computerId, dto) => req(`/api/computers/${computerId}/devices`, { method: 'POST', body: dto, auth: true }),
  updateDevice: (id, dto) => req(`/api/devices/${id}`, { method: 'PUT', body: dto, auth: true }),
  deleteDevice: (id) => req(`/api/devices/${id}`, { method: 'DELETE', auth: true }),
  createPromotion: (dto) => req('/api/promotions', { method: 'POST', body: dto, auth: true }),
  updatePromotion: (id, dto) => req(`/api/promotions/${id}`, { method: 'PUT', body: dto, auth: true }),
  deletePromotion: (id) => req(`/api/promotions/${id}`, { method: 'DELETE', auth: true }),
}

export const CATEGORY = { 0: 'Standard', 1: 'VIP', 2: 'PS5' }
export const CATEGORY_LIST = [
  { value: 0, label: 'Standard' },
  { value: 1, label: 'VIP' },
  { value: 2, label: 'PS5' },
]
export const BOOKING_STATUS = {
  0: { label: 'Активна', cls: 'ok' },
  1: { label: 'Завершена', cls: 'done' },
  2: { label: 'Скасована', cls: 'bad' },
}
