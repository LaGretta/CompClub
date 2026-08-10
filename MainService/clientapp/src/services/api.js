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

export const computersApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/computers`);
    if (!res.ok) throw new Error('Помилка завантаження комп\'ютерів');
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/computers/${id}`);
    if (!res.ok) throw new Error('Комп\'ютер не знайдено');
    return res.json();
  },

  getAvailable: async (start, end) => {
    const startDate = new Date(start).toISOString();
    const endDate = new Date(end).toISOString();
    
    const res = await fetch(`${API_BASE_URL}/computers/available?start=${startDate}&end=${endDate}`);
    if (!res.ok) throw new Error('Помилка перевірки доступності комп\'ютерів');
    return res.json();
  }
};

export const bookingsApi = {
  getMy: async () => {
    const res = await fetch(`${API_BASE_URL}/bookings/my`, {
      headers: getHeaders(true)
    });
    if (!res.ok) throw new Error('Помилка завантаження бронювань');
    return res.json();
  },

  create: async (computerId, startTime, endTime) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        computerId: Number(computerId),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
      })
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Час вже зайнятий або недостатньо коштів.');
    }
    return res.json();
  },

  cancel: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: getHeaders(true)
    });
    if (!res.ok) throw new Error('Не вдалося скасувати бронювання');
    return res.json();
  }
};

export const promotionsApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/promotions`);
    if (!res.ok) throw new Error('Помилка завантаження акцій');
    return res.json();
  }
};