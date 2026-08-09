// Фронт живе на тому ж домені, що й API (його віддає .NET), тому базовий шлях порожній
// і всі виклики йдуть на /api/... same-origin — без CORS.
const BASE = import.meta.env.VITE_API_BASE ?? ''

async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }
  return res.json()
}

export const api = {
  getComputers: () => get('/api/computers'),
  getDevices: (computerId) => get(`/api/computers/${computerId}/devices`),
  getPromotions: () => get('/api/promotions'),
}

// enum ComputerCategory: 0 Standard, 1 VIP, 2 PS5 (серіалізується числом)
export const CATEGORY = { 0: 'Standard', 1: 'VIP', 2: 'PS5' }
