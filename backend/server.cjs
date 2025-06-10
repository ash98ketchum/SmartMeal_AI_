// backend/server.cjs

// ─── Imports & Setup ───────────────────────────────────────────────
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');
const cron    = require('node-cron');
const { exec } = require('child_process');

const app  = express();
const PORT = process.env.PORT || 4000;

// Pick up a custom Python command, or fall back to "python"
const PYTHON = process.env.PYTHON_CMD || 'python';

// ─── Data Directories ──────────────────────────────────────────────
// Backend data folder and the folder under your React "public" to sync
const DATA_DIR           = path.join(__dirname, 'data');
const FRONTEND_DATA_DIR  = path.join(__dirname, '..', 'frontend', 'public', 'data');

// Ensure both directories exist
[DATA_DIR, FRONTEND_DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── File Name Constants ───────────────────────────────────────────
const FILES = {
  today:          'todaysserving.json',
  modelData:      'dataformodel.json',
  events:         'events.json',
  predicted:      'predicted.json',
  metricsWeekly:  'metrics_weekly.json',
  metricsMonthly: 'metrics_monthly.json',
};

// Helpers to build full paths
const p  = key => path.join(DATA_DIR, FILES[key]);
const fp = key => path.join(FRONTEND_DATA_DIR, FILES[key]);

// ─── JSON Read / Write Helpers ─────────────────────────────────────
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

// Sync backend + frontend (except for today's data)
function syncJson(key, data) {
  writeJson(p(key), data);
  if (key !== 'today') {
    writeJson(fp(key), data);
  }
}

// Read a single-object summary: take first element of array or object
function readSummary(key) {
  const raw = readJson(p(key));
  return Array.isArray(raw) ? raw[0] || {} : raw || {};
}

// Build actual time series for charts (weekly/monthly)
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

// ─── Express Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── CRUD for Today's Servings ─────────────────────────────────────
app.get('/api/servings', (_, res) => {
  res.json(readJson(p('today')));
});

app.post('/api/servings', (req, res) => {
  const arr = readJson(p('today'));
  arr.push(req.body);
  syncJson('today', arr);
  res.json({ message: 'Added' });
});

app.delete('/api/servings/:name', (req, res) => {
  const filtered = readJson(p('today')).filter(s => s.name !== req.params.name);
  syncJson('today', filtered);
  res.json({ message: 'Deleted' });
});

// ─── Archive & Reset (Upsert) ──────────────────────────────────────
// Upsert a single entry per date
function upsertModelData(dateStamp, items) {
  const md = readJson(p('modelData'));
  const idx = md.findIndex(d => d.date === dateStamp);
  if (idx >= 0) {
    md[idx].items = items;
  } else {
    md.push({ date: dateStamp, items });
  }
  md.sort((a, b) => new Date(a.date) - new Date(b.date));
  return md;
}

// Archive endpoint: upsert into modelData only
app.post('/api/archive', (_, res) => {
  const todayItems = readJson(p('today'));
  const dateStamp  = new Date().toISOString().split('T')[0];
  const updatedMD  = upsertModelData(dateStamp, todayItems);
  syncJson('modelData', updatedMD);
  // NOTE: we do NOT clear 'today' here
  res.json({ message: 'Archived (today retained)' });
});

// Manual reset of today's data
app.post('/api/reset', (_, res) => {
  syncJson('today', []);
  res.json({ message: 'Today cleared' });
});

// ─── Chart Data Endpoints ─────────────────────────────────────────
app.get('/api/dataformodel/:period', (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) {
    return res.status(400).json({ error: 'Invalid period' });
  }
  res.json(getSeries(p));
});

app.get('/api/predicted/:period', (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) {
    return res.status(400).json({ error: 'Invalid period' });
  }
  const series  = getSeries(p).map(d => ({
    date: d.date,
    predicted: d.actual,
    predictedEarning: d.actualEarning
  }));
  const summary = readSummary('predicted');
  res.json({ epsilon: summary.epsilon, series });
});

// ─── Metrics & Model Summary ───────────────────────────────────────
app.get('/api/metrics/weekly',  (_, res) => res.json(readSummary('metricsWeekly')));
app.get('/api/metrics/monthly', (_, res) => res.json(readSummary('metricsMonthly')));
app.get('/api/model/summary',  (_, res) => res.json(readSummary('predicted')));

// ─── Events CRUD ───────────────────────────────────────────────────
app.get('/api/events', (_, res) => {
  res.json(readJson(p('events')));
});
app.post('/api/events', (req, res) => {
  const evts = readJson(p('events'));
  evts.push(req.body);
  syncJson('events', evts);
  res.json({ message: 'Event added' });
});
app.delete('/api/events/:id', (req, res) => {
  const filtered = readJson(p('events')).filter(e => e.id !== req.params.id);
  syncJson('events', filtered);
  res.json({ message: 'Event deleted' });
});

// ─── Recalibrate Model Endpoint ────────────────────────────────────
app.post('/api/recalibrate', (_, res) => {
  exec(
    `${PYTHON} train_model.py --episodes=200`,
    { cwd: __dirname },
    (err, stdout, stderr) => {
      if (err) {
        console.error('Recalibration stderr:', stderr);
        return res.status(500).json({ message: 'Recalibration failed', error: stderr || err.message });
      }
      res.json({ message: 'Recalibration complete', output: stdout });
    }
  );
});

// ─── Nightly Cron Job (Midnight) ──────────────────────────────────
cron.schedule('0 0 * * *', () => {
  // 1) Upsert today’s data into modelData
  const todayItems = readJson(p('today'));
  const dateStamp  = new Date().toISOString().split('T')[0];
  const updatedMD  = upsertModelData(dateStamp, todayItems);
  syncJson('modelData', updatedMD);

  // 2) Clear today's data (once per day)
  syncJson('today', []);

  // 3) Retrain model
  exec(
    `${PYTHON} train_model.py --episodes=200`,
    { cwd: __dirname },
    err => {
      if (err) console.error('Cron retrain failed:', err);
    }
  );
});

// ─── Serve Frontend ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/.*/, (_, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
