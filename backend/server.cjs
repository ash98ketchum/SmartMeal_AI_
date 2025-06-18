// server.cjs

require('dotenv').config();
const express          = require('express');
const fs               = require('fs');
const path             = require('path');
const cors             = require('cors');
const cron             = require('node-cron');
const { exec }         = require('child_process');
const bcrypt           = require('bcrypt');
const jwt              = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma     = new PrismaClient();
const app        = express();
const PORT       = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const PYTHON_CMD = process.env.PYTHON_CMD || 'python';

// ── Data directories ─────────────────────────────────────────────────────────
const DATA_DIR          = path.join(__dirname, 'data');
const FRONTEND_DATA_DIR = path.join(__dirname, '..', 'frontend', 'public', 'data');
[DATA_DIR, FRONTEND_DATA_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const FILES = {
  today:          'todaysserving.json',
  modelData:      'dataformodel.json',
  events:         'events.json',
  predicted:      'predicted.json',
  metricsWeekly:  'metrics_weekly.json',
  metricsMonthly: 'metrics_monthly.json',
  foodItems:      'foodItems.json',
  reserved:       'reserved.json',
  cart:           'cart.json',
  requests:       'requests.json',
  ngorequests:    'ngorequests.json',
};

const dataPath   = key => path.join(DATA_DIR,      FILES[key]);
const publicPath = key => path.join(FRONTEND_DATA_DIR, FILES[key]);

function readJson(fp, fallback = []) {
  if (!fs.existsSync(fp)) fs.writeFileSync(fp, JSON.stringify(fallback, null, 2));
  const raw = fs.readFileSync(fp, 'utf8');
  return JSON.parse(raw || JSON.stringify(fallback));
}

function writeJson(fp, data) {
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
}

function syncJson(key, data) {
  writeJson(dataPath(key), data);
  if (key !== 'today') writeJson(publicPath(key), data);
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────
app.post('/api/v1/auth/signup', async (req, res) => {
  const { email, password, role, gstNumber, aadharNumber } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
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

// ── Servings endpoints ─────────────────────────────────────────────────────────
app.get('/api/servings', requireAuth, (req, res) => {
  const all   = readJson(dataPath('today'));
  const today = new Date().toISOString().split('T')[0];
  const filtered = all.filter(s => s.date === today);

  let needsSave = false;
  filtered.forEach(s => {
    if (!s.id) { s.id = Date.now().toString() + Math.random().toString(36).slice(2,6); needsSave = true; }
  });

  if (needsSave) {
    writeJson(dataPath('today'), filtered);
    writeJson(publicPath('today'), filtered);
  } else {
    writeJson(publicPath('today'), filtered);
  }

  res.json(filtered);
});

app.post('/api/servings', requireAuth, (req, res) => {
  const arr   = readJson(dataPath('today'));
  const today = new Date().toISOString().split('T')[0];
  const item  = { id: Date.now().toString(), date: today, ...req.body };
  arr.push(item);
  syncJson('today', arr);
  res.json({ message: 'Added', item });
});

app.delete('/api/servings/:id', requireAuth, (req, res) => {
  const all      = readJson(dataPath('today'));
  const filtered = all.filter(s => s.id !== req.params.id);
  syncJson('today', filtered);
  res.json({ message: 'Deleted' });
});

// ── Feedback endpoints ─────────────────────────────────────────────────────────
app.post('/api/feedback', (req, res) => {
  try {
    const feedbackPath = path.join(DATA_DIR, 'feedback.json');
    const newFb = { ...req.body, id: Date.now().toString(), submittedAt: new Date().toISOString() };
    const existing = fs.existsSync(feedbackPath) ? JSON.parse(fs.readFileSync(feedbackPath, 'utf8')) : [];
    existing.push(newFb);
    fs.writeFileSync(feedbackPath, JSON.stringify(existing, null, 2), 'utf8');
    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Failed to save feedback:', err);
    res.status(500).json({ error: 'Unable to save feedback' });
  }
});

app.get('/api/feedback', (req, res) => {
  const fp = path.join(DATA_DIR, 'feedback.json');
  const feedbacks = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : [];
  res.json(feedbacks);
});

// ── Reviews adapter ───────────────────────────────────────────────────────────
app.get('/api/reviews', (req, res) => {
  const filePath = path.join(DATA_DIR, 'feedback.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) { console.error(err); return res.status(500).json({ error: 'Failed to read reviews.' }); }
    try {
      const raw = JSON.parse(data);
      const reviews = raw.map(item => ({
        id:            item.id,
        reviewerName:  item.organizationName,
        reviewerType:  "ngo",
        targetName:    item.reviewFor,
        targetType:    "restaurant",
        rating:        item.rating,
        comment:       item.content,
        date:          item.submittedAt,
        foodItem:      item.menuItem || "",
        helpful:       0,
        verified:      true,
      }));
      res.json(reviews);
    } catch (parseError) {
      console.error(parseError);
      res.status(500).json({ error: 'Invalid reviews format.' });
    }
  });
});

// ── Food Upload ─────────────────────────────────────────────────────────────
app.post('/api/food', requireAuth, (req, res) => {
  const list = readJson(dataPath('foodItems'));
  const item = { ...req.body, id: Date.now().toString(), status: 'available', createdAt: new Date().toISOString() };
  list.push(item);
  syncJson('foodItems', list);
  res.json({ message: 'Food added', item });
});

// ── Available-Food for NGO ───────────────────────────────────────────────────
app.get('/api/available-food', requireAuth, (req, res) => {
  const all = readJson(dataPath('foodItems'));
  const now = new Date(), twoHoursAgo = new Date(now - 2*60*60*1000), today = now.toISOString().split('T')[0];
  // backfill createdAt
  all.forEach(i => { if(!i.createdAt) i.createdAt = now.toISOString(); });
  syncJson('foodItems', all);
  const fresh = all.filter(i => i.status==='available' && new Date(i.createdAt)>=twoHoursAgo && i.createdAt.split('T')[0]===today);
  syncJson('foodItems', fresh);
  res.json(fresh);
});

// ── Reserve Food ─────────────────────────────────────────────────────────────
app.post('/api/reserve-food', requireAuth, (req, res) => {
  const { id } = req.body;
  const all = readJson(dataPath('foodItems'));
  const idx = all.findIndex(i => i.id===id);
  if (idx<0) return res.status(404).json({ error:'Not found' });
  all[idx].status = 'reserved';
  all[idx].reservedAt = new Date().toISOString();
  syncJson('foodItems', all);
  const reserved = readJson(dataPath('reserved'), []);
  reserved.push(all[idx]);
  syncJson('reserved', reserved);
  res.json({ success:true });
});

// ── Save Cart → requests.json ────────────────────────────────────────────────
app.post('/api/save-cart', requireAuth, (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });

  // Persist cart.json
  syncJson('cart', items);

  // Append each to requests.json
  const existing = readJson(dataPath('requests'), []);
  items.forEach(f => {
    existing.push({
      id:              f.id,
      name:            f.name,
      quantity:        f.quantity,
      estimatedValue:  f.estimatedValue,
      restaurant:      f.restaurant,
      reservedAt:      f.reservedAt,
      pickupStartTime: f.pickupStartTime,
      pickupEndTime:   f.pickupEndTime,
      status:          'booked'
    });
  });
  syncJson('requests', existing);

  res.json({ message: 'Cart saved and requests created' });
});

// ── GET all requests ─────────────────────────────────────────────────────────
app.get('/api/requests', requireAuth, (req, res) => {
  const all = readJson(dataPath('requests'), []);
  res.json(all);
});

// ── Update one request’s status ──────────────────────────────────────────────
app.post('/api/requests/:id/status', requireAuth, (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  const all = readJson(dataPath('requests'), []);
  const idx = all.findIndex(r => String(r.id) === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  all[idx].status = status;
  syncJson('requests', all);
  res.json({ message: 'Status updated', id: req.params.id, status });
});

// ── DELETE helpers ───────────────────────────────────────────────────────────
app.delete('/api/cart', requireAuth, (req, res) => { syncJson('cart', []); res.json({ message: 'Cart cleared' }); });
app.delete('/api/reserved/:id', requireAuth, (req, res) => {
  const all = readJson(dataPath('reserved'), []);
  syncJson('reserved', all.filter(i => String(i.id) !== req.params.id));
  res.json({ message: 'Reserved item removed' });
});
app.delete('/api/food/:id', requireAuth, (req, res) => {
  const all = readJson(dataPath('foodItems'), []);
  syncJson('foodItems', all.filter(i => String(i.id) !== req.params.id));
  res.json({ message: 'Food item deleted' });
});


// ── Archive & reset ─────────────────────────────────────────────────────────────
app.post('/api/archive', requireAuth, (req, res) => {
  const arr       = readJson(dataPath('today'));
  const dateStamp = new Date().toISOString().split('T')[0];
  const md        = readJson(dataPath('modelData'));
  const idx       = md.findIndex(d => d.date === dateStamp);
  if (idx >= 0) md[idx].items = arr;
  else          md.push({ date: dateStamp, items: arr });
  md.sort((a,b) => new Date(a.date) - new Date(b.date));
  syncJson('modelData', md);
  res.json({ message: 'Archived' });
});

app.post('/api/reset', requireAuth, (req, res) => {
  syncJson('today', []);
  res.json({ message: 'Today cleared' });
});


// ── Time-series helpers & endpoints ────────────────────────────────────────────
function getSeries(period) {
  const all  = readJson(dataPath('modelData'));
  all.sort((a,b) => new Date(a.date) - new Date(b.date));
  const days = period === 'monthly' ? 30 : 7;
  return all.slice(-days).map(day => ({
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

app.get('/api/predicted/:period', requireAuth, (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) {
    return res.status(400).json({ error: 'Invalid period' });
  }
  const series = getSeries(p).map(d => ({
    date:             d.date,
    predicted:        d.actual,
    predictedEarning: d.actualEarning
  }));
  const sum = readSummary('predicted');
  res.json({ epsilon: sum.epsilon || 0, series });
});

app.get('/api/metrics/weekly', requireAuth, (req, res) => {
  res.json(readSummary('metricsWeekly'));
});
app.get('/api/metrics/monthly', requireAuth, (req, res) => {
  res.json(readSummary('metricsMonthly'));
});
app.get('/api/model/summary', requireAuth, (req, res) => {
  res.json(readSummary('predicted'));
});

// ── Events endpoints ────────────────────────────────────────────────────────────
app.get('/api/events', requireAuth, (req, res) => {
  const all      = readJson(dataPath('events'));
  const today    = new Date().toISOString().split('T')[0];
  const upcoming = all.filter(e => e.date >= today);
  syncJson('events', upcoming);
  res.json(upcoming);
});
app.post('/api/events', requireAuth, (req, res) => {
  const evts = readJson(dataPath('events'));
  evts.push(req.body);
  syncJson('events', evts);
  res.json({ message: 'Event added' });
});
app.delete('/api/events/:id', requireAuth, (req, res) => {
  const filtered = readJson(dataPath('events')).filter(e => e.id !== req.params.id);
  syncJson('events', filtered);
  res.json({ message: 'Event deleted' });
});

// ── Food-reservation endpoints ──────────────────────────────────────────────────
app.post('/api/food', requireAuth, (req, res) => {
  const list = readJson(dataPath('foodItems'));
  const item = {
    ...req.body,
    id:        Date.now().toString(),
    status:    'available',
    createdAt: new Date().toISOString()
  };
  list.push(item);
  syncJson('foodItems', list);
  res.json({ message: 'Food added', item });
});

// ------------------for fetching data from predicted.json to history---------
app.get('/api/predictions', (req, res) => {
  try {
    const file = dataPath('predicted');
    const data = readJson(file);

    const predictions = data.dishes.map((dish, index) => ({
      dishName: dish,
      qValue: parseFloat(data.q_values[index].toFixed(2)),
      count: data.counts[index],
      isBest: dish === data.bestAction.dish
    }));

    res.json(predictions); // This returns an array!
  } catch (err) {
    console.error('Error reading predictions:', err);
    res.status(500).json({ error: 'Failed to load predictions' });
  }
});

// ── GET available food (for NGO) ───────────────────────────────────────────────
app.get('/api/available-food', requireAuth, (req, res) => {
  // 1) Load the raw list
  const all   = readJson(dataPath('foodItems'));
  const now   = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const todayStr    = now.toISOString().split('T')[0];

  // 2) Back-fill any missing createdAt so old items aren’t instantly dropped
  all.forEach(item => {
    if (!item.createdAt) {
      item.createdAt = now.toISOString();
    }
  });
  // Persist those createdAt additions
  syncJson('foodItems', all);

  // 3) Filter out only the “fresh” items
  const fresh = all.filter(item => {
    if (item.status !== 'available') return false;
    const created = new Date(item.createdAt);
    const createdDate = created.toISOString().split('T')[0];
    return (
      created >= twoHoursAgo &&
      createdDate === todayStr
    );
  });

  // 4) Overwrite the JSON so expired items truly disappear
  syncJson('foodItems', fresh);

  // 5) Return what’s left
  res.json(fresh);
});


// ── Reserve a food item ─────────────────────────────────────────────────────────
app.post('/api/reserve-food', requireAuth, (req, res) => {
  const { id } = req.body;
  const all    = readJson(dataPath('foodItems'));
  const idx    = all.findIndex(i => i.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });

  all[idx].status     = 'reserved';
  all[idx].reservedAt = new Date().toISOString();
  syncJson('foodItems', all);

  const reservedList = readJson(dataPath('reserved'), []);
  reservedList.push(all[idx]);
  syncJson('reserved', reservedList);

  res.json({ success: true });
});

// ── Cron job: nightly archive & retrain ─────────────────────────────────────────
cron.schedule('0 0 * * *', () => {
  try {
    const arr   = readJson(dataPath('today'));
    const stamp = new Date().toISOString().split('T')[0];
    const md    = readJson(dataPath('modelData'));
    const idx   = md.findIndex(d => d.date === stamp);

    if (idx >= 0) md[idx].items = arr;
    else          md.push({ date: stamp, items: arr });

    md.sort((a,b) => new Date(a.date) - new Date(b.date));
    syncJson('modelData', md);

    writeJson(dataPath('today'), []);
    writeJson(publicPath('today'), []);
    exec(`${PYTHON_CMD} train_model.py --episodes=200`, { cwd: __dirname });
  } catch (e) {
    console.error('Cron job failed', e);
  }
});

// ── Static file serving ───────────────────────────────────────────────────────
app.use('/data', express.static(FRONTEND_DATA_DIR));
const FRONTEND_BUILD = path.join(__dirname, '../frontend/dist');
app.use(express.static(FRONTEND_BUILD));
app.get('*', (_, res) => res.sendFile(path.join(FRONTEND_BUILD, 'index.html')));

// ── Start server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});