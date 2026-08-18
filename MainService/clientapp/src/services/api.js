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
    return JSON.parse(localStorage.getItem('localBookings')) || [];
  },
  
  create: async (computerId, startTime, endTime, price = 0) => {
    const currentBalance = Number(localStorage.getItem('localUserBalance')) || 2000;
    const finalPrice = price || 1000; 

    // Перевіряємо, чи вистачає грошей
    if (currentBalance < finalPrice) {
      throw new Error('Недостатньо коштів на балансі!');
    }

    // Списуємо кошти локально
    localStorage.setItem('localUserBalance', (currentBalance - finalPrice).toString());

    // Створюємо нове бронювання
    const newBooking = {
      id: Date.now(),
      computerId: Number(computerId) || 'PS5-03',
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      totalPrice: finalPrice,
      status: 0, // 0 - Активне
      createdAt: new Date().toISOString()
    };

    // Зберігаємо бронювання
    const localBookings = JSON.parse(localStorage.getItem('localBookings')) || [];
    localBookings.push(newBooking);
    localStorage.setItem('localBookings', JSON.stringify(localBookings));

    return newBooking;
  },
  
  cancel: async (bookingId) => {
    const localBookings = JSON.parse(localStorage.getItem('localBookings')) || [];
    const booking = localBookings.find(b => b.id === bookingId);
    
    if (booking && booking.status === 0) {
        // Змінюємо статус на "Скасовано"
        booking.status = 2; 
        localStorage.setItem('localBookings', JSON.stringify(localBookings));
        
        // Повертаємо гроші на баланс
        const currentBalance = Number(localStorage.getItem('localUserBalance')) || 2000;
        localStorage.setItem('localUserBalance', (currentBalance + booking.totalPrice).toString());
    }
    
    return { success: true };
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

// Юзери та Баланс
export const usersApi = {
  getMe: async () => {
    const localBalance = localStorage.getItem('localUserBalance');
    if (localBalance === null) {
      localStorage.setItem('localUserBalance', '2000');
      return { balance: 2000 };
    }
    return { balance: Number(localBalance) };
  },
  topUp: async (amount = 500) => {
    const currentBalance = Number(localStorage.getItem('localUserBalance')) || 2000;
    const newBalance = currentBalance + Number(amount);
    localStorage.setItem('localUserBalance', newBalance.toString());
    return { success: true, balance: newBalance };
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
      credentials: 'include',
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
      headers: getHeaders(true),
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Не вдалося видалити турнір');
    return true; 
  },
  register: async (tournamentId, registrationData) => {
    const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/register`, {
      method: 'POST',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(registrationData)
    });
    if (!res.ok) {
      let errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Помилка реєстрації.');
    }
    return res.json();
  }
};