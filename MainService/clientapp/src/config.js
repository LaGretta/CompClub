// Базовий шлях MainService API. Порожньо = той самий домен (фронт віддає сам MainService).
export const API_BASE = import.meta.env.VITE_API_BASE ?? ''

// Базовий URL AuthService (сервіс Данила) — ЗВІДКИ беруться токени.
// Задається змінною VITE_AUTH_BASE на етапі збірки, напр. https://auth-production.up.railway.app
export const AUTH_BASE = import.meta.env.VITE_AUTH_BASE ?? ''

export const authConfigured = AUTH_BASE !== ''
