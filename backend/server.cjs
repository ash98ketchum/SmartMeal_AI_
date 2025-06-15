// server.cjs

require('dotenv').config();
const express       = require('express');
const fs            = require('fs');
const path          = require('path');
const cors          = require('cors');
const cron          = require('node-cron');
const { exec }      = require('child_process');
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma      = new PrismaClient();
const app         = express();
const PORT        = process.env.PORT || 4000;
const JWT_SECRET  = process.env.JWT_SECRET || 'changeme';        // set a real secret in .env
const PYTHON_CMD  = process.env.PYTHON_CMD || 'python';

//
// ── Set up your data directories ────────────────────────────────────────────────
//
const DATA_DIR          = path.join(__dirname, 'data');
const FRONTEND_DATA_DIR = path.join(__dirname, '..', 'frontend', 'public', 'data');

// ensure both exist
[DATA_DIR, FRONTEND_DATA_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// map logical names → filenames
const FILES = {
  today:         'todaysserving.json',
  modelData:     'dataformodel.json',
  events:        'events.json',
  predicted:     'predicted.json',       // your bandit summary
  metricsWeekly: 'metrics_weekly.json',
  metricsMonthly:'metrics_monthly.json',
  foodItems:     'foodItems.json',
};

// helpers for file paths
const dataPath    = (k) => path.join(DATA_DIR, FILES[k]);
const publicPath  = (k) => path.join(FRONTEND_DATA_DIR, FILES[k]);

// read/write JSON helpers
function readJson(fp, fallback = []) {
  if (!fs.existsSync(fp)) fs.writeFileSync(fp, JSON.stringify(fallback, null, 2));
  const raw = fs.readFileSync(fp, 'utf8');
  return JSON.parse(raw || JSON.stringify(fallback));
}
function writeJson(fp, data) {
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
}
// writes to both DATA_DIR and FRONTEND_DATA_DIR (so your client can fetch under /data)
function syncJson(key, data) {
  writeJson(dataPath(key),      data);
  if (key !== 'today') writeJson(publicPath(key), data);
}
// for reading “summary” files that might be either `[]` or `{…}` or `[{}]`
function readSummary(key) {
  const raw = readJson(dataPath(key), []);
  if (Array.isArray(raw)) return raw[0] || {};
  return raw;
}

//
// ── Express + CORS + JSON body parsing ──────────────────────────────────────────
//
app.use(cors());
app.use(express.json({ limit: '10mb' }));

//
// ── Authentication Middleware ───────────────────────────────────────────────────
//
function requireAuth(req, res, next) {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(auth, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

//
// ── Auth Routes ─────────────────────────────────────────────────────────────────
//
app.post('/api/v1/auth/signup', async (req, res) => {
  const { email, password, role, gstNumber, aadharNumber } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, role, passwordHash: hash, gstNumber, aadharNumber }
    });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Email already in use' });
    console.error(e);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

//
// ── Protected API Routes (all under /api) ───────────────────────────────────────
//
app.get('/api/servings',           requireAuth, (req, res) => {
  const all   = readJson(dataPath('today'));
  const today = new Date().toISOString().split('T')[0];
  const filtered = all.filter((s) => s.date === today);
  // keep the “public” copy in sync
  writeJson(publicPath('today'), filtered);
  res.json(filtered);
});

app.post('/api/servings',          requireAuth, (req, res) => {
  const arr = readJson(dataPath('today'));
  const today = new Date().toISOString().split('T')[0];
  arr.push({ ...req.body, date: today });
  syncJson('today', arr);
  res.json({ message: 'Added' });
});

app.post('/api/archive',           requireAuth, (req, res) => {
  const arr = readJson(dataPath('today'));
  const dateStamp = new Date().toISOString().split('T')[0];
  // upsert into modelData
  const md = readJson(dataPath('modelData'));
  const idx = md.findIndex((d) => d.date === dateStamp);
  const items = arr;
  if (idx >= 0) md[idx].items = items;
  else         md.push({ date: dateStamp, items });
  md.sort((a,b)=>new Date(a.date)-new Date(b.date));
  syncJson('modelData', md);
  res.json({ message: 'Archived' });
});

app.post('/api/reset',             requireAuth, (req, res) => {
  syncJson('today', []);
  res.json({ message: 'Today cleared' });
});

// helper to build your “actual” series
function getSeries(period) {
  const all = readJson(dataPath('modelData'));
  all.sort((a,b)=>new Date(a.date)-new Date(b.date));
  const days = period === 'monthly' ? 30 : 7;
  return all.slice(-days).map((day) => ({
    date:           day.date,
    actual:         day.items.reduce((s,i)=>s+(i.totalPlates||0),0),
    actualEarning: parseFloat(
                      day.items.reduce((s,i)=>s+(i.totalEarning||0),0)
                    .toFixed(2))
  }));
}

app.get('/api/dataformodel/:period', requireAuth, (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) {
    return res.status(400).json({ error: 'Invalid period' });
  }
  res.json(getSeries(p));
});

app.get('/api/predicted/:period',    requireAuth, (req, res) => {
  // for now we fake “predicted” by mirroring actual
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) {
    return res.status(400).json({ error: 'Invalid period' });
  }
  const series = getSeries(p).map((d) => ({
    date: d.date,
    predicted: d.actual,
    predictedEarning: d.actualEarning
  }));
  const sum = readSummary('predicted');
  res.json({ epsilon: sum.epsilon || 0, series });
});

app.get('/api/metrics/weekly',       requireAuth, (req, res) => {
  res.json(readSummary('metricsWeekly'));
});
app.get('/api/metrics/monthly',      requireAuth, (req, res) => {
  res.json(readSummary('metricsMonthly'));
});
app.get('/api/model/summary',        requireAuth, (req, res) => {
  res.json(readSummary('predicted'));
});

app.get('/api/events',               requireAuth, (req, res) => {
  const all   = readJson(dataPath('events'));
  const today = new Date().toISOString().split('T')[0];
  const upcoming = all.filter((e) => e.date >= today);
  syncJson('events', upcoming);
  res.json(upcoming);
});
app.post('/api/events',              requireAuth, (req, res) => {
  const evts = readJson(dataPath('events'));
  evts.push(req.body);
  syncJson('events', evts);
  res.json({ message: 'Event added' });
});
app.delete('/api/events/:id',        requireAuth, (req, res) => {
  const filtered = readJson(dataPath('events')).filter((e) => e.id !== req.params.id);
  syncJson('events', filtered);
  res.json({ message: 'Event deleted' });
});

app.post('/api/recalibrate',         requireAuth, (req, res) => {
  exec(`${PYTHON_CMD} train_model.py --episodes=200`, { cwd: __dirname }, (err) => {
    if (err) return res.status(500).json({ message: 'Recalibration failed' });
    res.json({ message: 'Recalibration complete' });
  });
});

//
// ── Food‐reservation endpoints ─────────────────────────────────────────────────
//
app.post('/api/food',                requireAuth, (req, res) => {
  const list = readJson(dataPath('foodItems'));
  const item = { ...req.body, id: Date.now().toString(), status: 'available' };
  list.push(item);
  syncJson('foodItems', list);
  res.json({ message: 'Food added', item });
});
app.get('/api/available-food', (req, res) => {
  const all = readJson(dataPath('foodItems'));
  res.json(all.filter((i) => i.status === 'available'));
});
app.post('/api/reserve-food', (req, res) => {
  const { id } = req.body;
  const all = readJson(dataPath('foodItems'));
  const idx = all.findIndex((i) => i.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  all[idx].status = 'reserved';
  syncJson('foodItems', all);
  res.json({ success: true });
});
app.post('/api/unreserve-food',      requireAuth, (req, res) => {
  const { id } = req.body;
  const all = readJson(dataPath('foodItems'));
  const idx = all.findIndex((i) => i.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  all[idx].status = 'available';
  syncJson('foodItems', all);
  res.json({ success: true });
});

//
// ── Cron job: every night at midnight ────────────────────────────────────────────
//
cron.schedule('0 0 * * *', () => {
  try {
    // archive today’s servings
    const arr = readJson(dataPath('today'));
    const stamp = new Date().toISOString().split('T')[0];
    const md = readJson(dataPath('modelData'));
    const idx = md.findIndex((d) => d.date === stamp);
    if (idx >= 0) md[idx].items = arr;
    else         md.push({ date: stamp, items: arr });
    md.sort((a,b)=>new Date(a.date)-new Date(b.date));
    syncJson('modelData', md);
    // clear today
    writeJson(dataPath('today'), []);
    writeJson(publicPath('today'), []);
    // retrain  
    exec(`${PYTHON_CMD} train_model.py --episodes=200`, { cwd: __dirname });
  } catch (e) {
    console.error('Cron job failed', e);
  }
});

//
// ── Static file serving for your front-end ──────────────────────────────────────
//
app.use('/data', express.static(FRONTEND_DATA_DIR));

const FRONTEND_BUILD = path.join(__dirname, '../frontend/dist');
app.use(express.static(FRONTEND_BUILD));
app.get('*', (_, res) => {
  res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
});

//
// ── Start listening ──────────────────────────────────────────────────────────────
//
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
