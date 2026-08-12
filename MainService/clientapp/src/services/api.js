const API_BASE_URL = import.meta.env.VITE_API_BASE ?? '/api';

const getHeaders = (requireAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (requireAuth) {
    const token = localStorage.getItem('token'); 
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Комп'ютери
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

// Бронювання
export const bookingsApi = {
  getMy: async () => {
    const res = await fetch(`${API_BASE_URL}/bookings/my`, { headers: getHeaders(true) });
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
        let errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Час зайнятий або недостатньо коштів.');
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

// Акції
export const promotionsApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/promotions`);
    if (!res.ok) throw new Error('Помилка завантаження акцій');
    return res.json();
  }
};

// Юзери
export const usersApi = {
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/users/me`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error('Не вдалося завантажити профіль');
    return res.json();
  },
  topUp: async (amount) => {
    const res = await fetch(`${API_BASE_URL}/users/topup`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ amount: Number(amount) })
    });
    if (!res.ok) throw new Error('Помилка поповнення рахунку');
    return res.json();
  }
};

// Турніри
export const tournamentsApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/tournaments`);
    if (!res.ok) throw new Error('Помилка завантаження турнірів');
    return res.json();
  },
  create: async (tournamentData) => {
    const res = await fetch(`${API_BASE_URL}/tournaments`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(tournamentData)
    });
    if (!res.ok) {
      let errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Не вдалося створити турнір');
    }
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    if (!res.ok) throw new Error('Не вдалося видалити турнір');
    return true; 
  }
};