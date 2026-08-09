import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function AIHelper() {
  const [open, setOpen] = useState(false);

  return (
    <div className="assistant">
      {open && (
        <div className="card" style={{ width: 280 }}>
          <h3>CYBERION ASSISTANT</h3>

          <p style={{ color: 'var(--muted)' }}>
            Привіт 👋 Допоможу підібрати найкраще місце для гри або бронювання.
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexDirection: 'column' }}>
            <button className="btn">🎮 Найкращі ПК</button>
            <button className="btn">💎 VIP кімнати</button>
            <button className="btn">📅 Забронювати місце</button>
          </div>
        </div>
      )}

      <button className="bubble" onClick={() => setOpen(!open)} aria-label="assistant">
        {open ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}