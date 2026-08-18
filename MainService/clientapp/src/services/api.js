const API_BASE_URL = import.meta.env.VITE_API_BASE ?? '/api';

const getHeaders = (requireAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (requireAuth) {
    const token = localStorage.getItem('token'); 
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return 'guest';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 
           payload.unique_name || 
           payload.email || 
           'user';
  } catch (e) {
    return 'user';
  }
};

const getUserBalance = (username) => {
  const balances = JSON.parse(localStorage.getItem('localBalances')) || {};
  if (balances[username] === undefined) {
    balances[username] = 2000;
    localStorage.setItem('localBalances', JSON.stringify(balances));
  }
  return balances[username];
};

const setUserBalance = (username, amount) => {
  const balances = JSON.parse(localStorage.getItem('localBalances')) || {};
  balances[username] = amount;
  localStorage.setItem('localBalances', JSON.stringify(balances));
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
    
    let availableComputers = await res.json();

    const localBookings = JSON.parse(localStorage.getItem('localBookings')) || [];
    const reqStart = new Date(start).getTime();
    const reqEnd = new Date(end).getTime();

    // Тут перевіряємо ВСІ бронювання. Якщо комп зайнятий кимось - він зайнятий для всіх!
    availableComputers = availableComputers.filter(comp => {
      const isOccupiedLocally = localBookings.some(b => {
        if (b.status !== 0) return false; 
        if (String(b.computerId) !== String(comp.id)) return false; 
        const bStart = new Date(b.startTime).getTime();
        const bEnd = new Date(b.endTime).getTime();
        return (reqStart < bEnd && reqEnd > bStart);
      });
      return !isOccupiedLocally; 
    });

    return availableComputers;
  }
};

// Бронювання
export const bookingsApi = {
  getMy: async () => {
    const currentUser = getCurrentUser();
    const allBookings = JSON.parse(localStorage.getItem('localBookings')) || [];
    return allBookings.filter(b => b.owner === currentUser);
  },
  
  create: async (computerId, startTime, endTime, providedPrice) => {
    const currentUser = getCurrentUser();
    const currentBalance = getUserBalance(currentUser);
    
    let actualHourlyRate = 55;
    let compName = `Комп'ютер #${computerId}`;

    try {
      const compsRes = await fetch(`${API_BASE_URL}/computers`);
      if (compsRes.ok) {
        const comps = await compsRes.json();
        const targetComp = comps.find(c => String(c.id) === String(computerId));
        if (targetComp) {
          actualHourlyRate = Number(targetComp.pricePerHour) || 55;
          compName = targetComp.name; 
        }
      }
    } catch(e) {}

    let finalPrice = Number(providedPrice);
    if (!finalPrice) {
      const s = new Date(startTime);
      const e = new Date(endTime);
      let hours = Math.abs(e - s) / 36e5;
      hours = Math.round(hours * 10) / 10;
      if (hours === 0 || isNaN(hours)) hours = 1;
      finalPrice = Math.round(hours * actualHourlyRate);
    }

    if (currentBalance < finalPrice) {
      throw new Error(`Недостатньо коштів! Потрібно ${finalPrice} ₴.`);
    }
    
    setUserBalance(currentUser, currentBalance - finalPrice);

    const newBooking = {
      id: Date.now(),
      owner: currentUser,
      computerId: computerId || '1',
      computerName: compName,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      totalPrice: finalPrice,
      status: 0,
      createdAt: new Date().toISOString()
    };

    const localBookings = JSON.parse(localStorage.getItem('localBookings')) || [];
    localBookings.push(newBooking);
    localStorage.setItem('localBookings', JSON.stringify(localBookings));

    return newBooking;
  },
  
  cancel: async (bookingId) => {
    const currentUser = getCurrentUser();
    const localBookings = JSON.parse(localStorage.getItem('localBookings')) || [];
    const booking = localBookings.find(b => b.id === bookingId);
  
    if (booking && booking.status === 0 && booking.owner === currentUser) {
        booking.status = 2; 
        localStorage.setItem('localBookings', JSON.stringify(localBookings));
        const currentBalance = getUserBalance(currentUser);
        setUserBalance(currentUser, currentBalance + booking.totalPrice);
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
    const currentUser = getCurrentUser();
    return { balance: getUserBalance(currentUser) };
  },
  topUp: async (amount = 500) => {
    const currentUser = getCurrentUser();
    const currentBalance = getUserBalance(currentUser);
    const newBalance = currentBalance + Number(amount);
    setUserBalance(currentUser, newBalance);
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