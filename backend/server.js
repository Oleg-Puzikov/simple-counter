import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

// CORS в dev (из браузера с http://localhost:3000 к http://localhost:3001)
const allowOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowOrigin, credentials: false }));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'app',
  database: process.env.DB_NAME || 'counter',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/healthz', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// логирование событий: {button: 'plus' | 'minus'}
app.post('/api/events', async (req, res) => {
  try {
    const { button } = req.body || {};
    if (button !== 'plus' && button !== 'minus') {
      return res.status(400).json({ error: "button must be 'plus' or 'minus'" });
    }
    await pool.execute(
      'INSERT INTO events (button, pressed_at) VALUES (?, NOW())',
      [button]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'DB insert failed' });
  }
});

// (опц.) получить последние 20 событий
app.get('/api/events', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, button, pressed_at FROM events ORDER BY id DESC LIMIT 20');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API listening on :${port}`));
