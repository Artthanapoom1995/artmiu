// Artmiu — Moonlab. Live Tracker (standalone service)
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3100;

app.use(express.json({ limit: '1mb' }));

// ─── storage: Postgres (Neon/Render — ตั้ง DATABASE_URL) หรือไฟล์ JSON (รันในเครื่อง) ───
let store;
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const ready = pool.query('CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)');
  store = {
    type: 'postgres',
    get: async k => { await ready; const r = await pool.query('SELECT value FROM kv WHERE key=$1', [k]); return r.rows[0] ? r.rows[0].value : null; },
    set: async (k, v) => { await ready; await pool.query('INSERT INTO kv(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2', [k, v]); }
  };
} else {
  const DATA = path.join(__dirname, 'data');
  fs.mkdirSync(DATA, { recursive: true });
  const file = k => path.join(DATA, k + '.json');
  store = {
    type: 'file',
    get: async k => fs.existsSync(file(k)) ? fs.readFileSync(file(k), 'utf8') : null,
    set: async (k, v) => fs.writeFileSync(file(k), v)
  };
}

// ─── routes ───
app.get('/', (req, res) => res.redirect('/moonlab'));
app.get('/moonlab', (req, res) => res.sendFile(path.join(__dirname, 'public', 'moonlab.html')));

app.get('/api/moonlab', async (req, res) => {
  try { const raw = await store.get('moonlab_state'); res.json(raw ? JSON.parse(raw) : null); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/moonlab', async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.months && !body.days) return res.status(400).json({ error: 'invalid state' });
    await store.set('moonlab_state', JSON.stringify(body));
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/healthz', (req, res) => res.type('text').send('ok'));

app.use(express.static(path.join(__dirname, 'public')));

// ─── keep-alive: ping ตัวเองทุก 10 นาที กัน Render free หลับ ───
function startKeepAlive() {
  const url = process.env.RENDER_EXTERNAL_URL;
  if (!url) return;
  const https = require('https');
  setInterval(() => { https.get(url + '/healthz', r => r.resume()).on('error', () => {}); }, 10 * 60 * 1000);
}

app.listen(PORT, () => {
  console.log(`Artmiu — Moonlab. tracker on :${PORT} (storage: ${store.type})`);
  startKeepAlive();
});
