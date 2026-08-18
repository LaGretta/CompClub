import React, { createContext, useState, useCallback, useContext } from 'react';

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Автоматично ховаємо повідомлення через 4 секунди
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Контейнер для повідомлень*/}
      <div style={{
        position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '16px', pointerEvents: 'none'
      }}>
        {toasts.map(toast => {
          const isError = toast.type === 'error';
          const color = isError ? '#ef4444' : '#facc15';
          
          return (
            <div key={toast.id} style={{
              background: 'rgba(12, 12, 14, 0.9)',
              backdropFilter: 'blur(12px)',
              borderLeft: `4px solid ${color}`,
              borderTop: '1px solid #3f3f46',
              borderRight: '1px solid #3f3f46',
              borderBottom: '1px solid #3f3f46',
              borderRadius: '8px',
              padding: '16px 24px',
              color: '#fff',
              minWidth: '320px',
              maxWidth: '450px',
              boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${isError ? 'rgba(239,68,68,0.15)' : 'rgba(250,204,21,0.15)'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
              animation: 'slideInToast 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              pointerEvents: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>
                   {isError ? '❌' : '✅'}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px', lineHeight: 1.4, wordBreak: 'break-word' }}>
                   {toast.message}
                </span>
              </div>
              <button onClick={() => removeToast(toast.id)} style={{
                background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', 
                fontSize: '18px', padding: 0, lineHeight: 1, transition: 'color 0.2s'
              }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#a1a1aa'}>
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Анімація виїзду */}
      <style>{`
        @keyframes slideInToast {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};