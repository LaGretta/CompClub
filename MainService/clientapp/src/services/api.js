// Базова URL. Дані віддає той самий MainService (same-origin /api).
// Локально можна перевизначити через VITE_API_BASE (напр. https://localhost:7262/api).
const API_BASE_URL = import.meta.env.VITE_API_BASE ?? '/api';

const getHeaders = (requireAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    const token = localStorage.getItem('token'); 
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Комп'ютери
export const computersApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/computers`);
    return res.json();
  },

  // Отримати один ПК
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/computers/${id}`);
    if (!res.ok) throw new Error('Комп\'ютер не знайдено');
    return res.json();
  },

  // Отримати вільні ПК у вказаному проміжку
  getAvailable: async (start, end) => {
    const startDate = new Date(start).toISOString();
    const endDate = new Date(end).toISOString();
    
    const res = await fetch(`${API_BASE_URL}/computers/available?start=${startDate}&end=${endDate}`);
    return res.json();
  }
};

// 2. Бронювання (тільки авторизовані)
export const bookingsApi = {
  getMy: async () => {
    const res = await fetch(`${API_BASE_URL}/bookings/my`, {
      headers: getHeaders(true)
    });
    if (!res.ok) throw new Error('Помилка завантаження бронювань');
    return res.json();
  },

  // Створити бронювання
  create: async (computerId, startTime, endTime) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        computerId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
      })
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Не вдалося створити бронювання. Можливо, час вже зайнятий.');
    }
    return res.json();
  },

  // Скасувати бронювання
  cancel: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: getHeaders(true)
    });
    if (!res.ok) throw new Error('Не вдалося скасувати бронювання');
    return res.json();
  }
};

// Акції
export const promotionsApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/promotions`);
    return res.json();
  }
};