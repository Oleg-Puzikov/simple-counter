import React, { useState } from "react";

export default function App() {
  const [value, setValue] = useState(0);

  return (
    <main className="container">
      <div className="card">
        <h1>Простой счётчик</h1>
        <div className="value">{value}</div>
        <div className="row">
          <button aria-label="Уменьшить" onClick={() => setValue(v => v - 1)}>−</button>
          <button aria-label="Увеличить" onClick={() => setValue(v => v + 1)}>+</button>
        </div>
        <p className="small">Без backend и API. Состояние — в памяти.</p>
      </div>
    </main>
  );
}
