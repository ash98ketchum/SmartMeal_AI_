require('dotenv').config();
const express        = require('express');
const fs             = require('fs');
const path           = require('path');
const cors           = require('cors');
const cron           = require('node-cron');
const { exec }       = require('child_process');
const bcrypt         = require('bcrypt');
const jwt            = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app    = express();
const PORT   = process.env.PORT || 4000;
const PYTHON = process.env.PYTHON_CMD || 'python';

// Data directories
const DATA_DIR          = path.join(__dirname, 'data');
const FRONTEND_DATA_DIR = path.join(__dirname, '..', 'frontend', 'public', 'data');
[DATA_DIR, FRONTEND_DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// File constants
const FILES = {
  today:          'todaysserving.json',
  modelData:      'dataformodel.json',
  events:         'events.json',
  predicted:      'predicted.json',
  metricsWeekly:  'metrics_weekly.json',
  metricsMonthly: 'metrics_monthly.json',
};

const p  = key => path.join(DATA_DIR, FILES[key]);
const fp = key => path.join(FRONTEND_DATA_DIR, FILES[key]);

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
  }
  const raw = fs.readFileSync(filePath, 'utf8') || '[]';
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function syncJson(key, data) {
  writeJson(p(key), data);
  if (key !== 'today') writeJson(fp(key), data);
}

function readSummary(key) {
  const raw = readJson(p(key));
  return Array.isArray(raw) ? raw[0] || {} : raw || {};
}

function getSeries(period) {
  const all = readJson(p('modelData'));
  all.sort((a, b) => new Date(a.date) - new Date(b.date));
  const days = period === 'monthly' ? 30 : 7;
  return all.slice(-days).map(day => ({
    date: day.date,
    actual: day.items.reduce((sum, itm) => sum + (itm.totalPlates || 0), 0),
    actualEarning: parseFloat(
      day.items.reduce((sum, itm) => sum + (itm.totalEarning || 0), 0)
      .toFixed(2)
    )
  }));
}

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- Auth Endpoints ---
app.post('/api/v1/auth/signup', async (req, res) => {
  const { email, password, role, gstNumber, aadharNumber } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'email, password & role required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash: hash, role, gstNumber, aadharNumber }
    });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    console.error(e);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token });
});

function requireAuth(req, res, next) {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).end();
  try {
    req.user = jwt.verify(auth, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).end();
  }
}

// --- CRUD for Today's Servings ---
app.get('/api/servings', requireAuth, (_, res) => {
  const all = readJson(p('today'));
  const today = new Date().toISOString().split("T")[0];

  // Keep only today's entries
  const filtered = all.filter(s => s.date === today);

  // Auto-update file to clean outdated
  syncJson('today', filtered);
  res.json(filtered);
});

app.post('/api/servings', requireAuth, (req, res) => {
  const arr = readJson(p('today'));
  const today = new Date().toISOString().split("T")[0];

  // Attach today's date to every new entry
  const newItem = { ...req.body, date: today };
  arr.push(newItem);

  syncJson('today', arr);
  res.json({ message: 'Added' });
});


// --- Archive & Reset ---
function upsertModelData(dateStamp, items) {
  const md = readJson(p('modelData'));
  const idx = md.findIndex(d => d.date === dateStamp);
  if (idx >= 0) md[idx].items = items;
  else md.push({ date: dateStamp, items });
  md.sort((a, b) => new Date(a.date) - new Date(b.date));
  return md;
}

app.post('/api/archive', requireAuth, (_, res) => {
  const todayItems = readJson(p('today'));

  const dateStamp  = new Date().toISOString().split('T')[0];
  const updatedMD  = upsertModelData(dateStamp, todayItems);
  syncJson('modelData', updatedMD);
  res.json({ message: 'Archived (today retained)' });
});

app.post('/api/reset', requireAuth, (_, res) => {
  syncJson('today', []);
  res.json({ message: 'Today cleared' });
});

// --- Chart Data Endpoints ---
app.get('/api/dataformodel/:period', requireAuth, (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) return res.status(400).json({ error: 'Invalid period' });
  res.json(getSeries(p));
});

app.get('/api/predicted/:period', requireAuth, (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) return res.status(400).json({ error: 'Invalid period' });
  const series  = getSeries(p).map(d => ({ date: d.date, predicted: d.actual, predictedEarning: d.actualEarning }));
  const summary = readSummary('predicted');
  res.json({ epsilon: summary.epsilon, series });
});

// --- Metrics & Model Summary ---
app.get('/api/metrics/weekly',  requireAuth, (_, res) => res.json(readSummary('metricsWeekly')));
app.get('/api/metrics/monthly', requireAuth, (_, res) => res.json(readSummary('metricsMonthly')));
app.get('/api/model/summary',  requireAuth, (_, res) => res.json(readSummary('predicted')));

// --- Events CRUD ---
app.get('/api/events', requireAuth, (_, res) => {
  const all = readJson(p('events'));
  const today = new Date().toISOString().split("T")[0];

  // Keep only today's or future events
  const filtered = all.filter(e => e.date >= today);

  // Auto-update file to remove old events
  syncJson('events', filtered);
  res.json(filtered);
});

app.post('/api/events', requireAuth, (req, res) => {
  const evts = readJson(p('events'));
  evts.push(req.body);
  syncJson('events', evts);
  res.json({ message: 'Event added' });
});

app.delete('/api/events/:id', requireAuth, (req, res) => {
  const filtered = readJson(p('events')).filter(e => e.id !== req.params.id);
  syncJson('events', filtered);
  res.json({ message: 'Event deleted' });
});


// --- Recalibrate Model Endpoint ---
app.post('/api/recalibrate', requireAuth, (_, res) => {
  exec(
    `${PYTHON} train_model.py --episodes=200`, { cwd: __dirname },
    (err, stdout, stderr) => {
      if (err) {
        console.error('Recalibration stderr:', stderr);
        return res.status(500).json({ message: 'Recalibration failed', error: stderr || err.message });
      }
      res.json({ message: 'Recalibration complete', output: stdout });
    }
  );
});

// --- Nightly Cron Job ---
cron.schedule('0 0 * * *', () => {
  const todayItems = readJson(p('today'));
  const dateStamp  = new Date().toISOString().split('T')[0];
  const updatedMD  = upsertModelData(dateStamp, todayItems);
  syncJson('modelData', updatedMD);
  syncJson('today', []);
  exec(`${PYTHON} train_model.py --episodes=200`, { cwd: __dirname }, err => {
    if (err) console.error('Cron retrain failed:', err);
  });
});

// --- Serve Frontend ---
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/.*/, (_, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
