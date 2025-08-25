import React, { useState } from "react";

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

export default function App() {
  const [value, setValue] = useState(0);

  const onMinus = () => {
    setValue(v => v - 1);
    logEvent("minus");
  };
  const onPlus = () => {
    setValue(v => v + 1);
    logEvent("plus");
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
      </div>
    </main>
  );
}
