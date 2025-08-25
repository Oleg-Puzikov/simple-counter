import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || ""; // dev: http://localhost:3001, prod: пусто => относительный /api

async function logEvent(button) {
  try {
    await fetch(`${API}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ button })
    });
  } catch (e) {
    console.warn("logEvent failed:", e);
  }
}

async function fetchEvents() {
  const res = await fetch(`${API}/api/events?limit=all`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export default function App() {
  const [value, setValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload(); // загрузка при монтировании
  }, []);

  const onMinus = async () => {
    setValue(v => v - 1);
    try { await logEvent("minus"); } finally { reload(); }
  };
  const onPlus = async () => {
    setValue(v => v + 1);
    try { await logEvent("plus"); } finally { reload(); }
  };

  return (
    <main className="container">
      <div className="card">
        <h1>Простой счётчик</h1>
        <div className="value">{value}</div>
        <div className="row">
          <button aria-label="Уменьшить" onClick={onMinus}>−</button>
          <button aria-label="Увеличить" onClick={onPlus}>+</button>
        </div>
        <p className="small">Логи нажатий: {`button (plus/minus), pressed_at (DATETIME)`}</p>
        {/* Таблица событий */}
        <div className="events-wrap">
          <h2 className="events-title">События</h2>
          {loading ? (
            <div className="events-loading">Загрузка…</div>
          ) : (
            <table className="events">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Кнопка</th>
                  <th>Время</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id}>
                    <td>{ev.id}</td>
                    <td>{ev.button}</td>
                    <td>
                      {ev.pressed_at
                        ? new Date(ev.pressed_at).toLocaleString()
                        : ""}
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan="3" style={{textAlign:'center'}}>Записей нет</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
