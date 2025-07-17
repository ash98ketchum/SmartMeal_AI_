// server.cjs

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

// ── File mapping ──────────────────────────────────────────────────────────────
const FILES = {
  today:           'todaysserving.json',
  modelData:       'dataformodel.json',
  events:          'events.json',
  predicted:       'predicted.json',
  predictedWeekly: 'predicted_weekly.json',
  metricsWeekly:   'metrics_weekly.json',
  metricsMonthly:  'metrics_monthly.json',
  foodItems:       'foodItems.json',
  reserved:        'reserved.json',
  cart:            'cart.json',
  requests:        'requests.json',
  feedback:        'feedback.json'
};

const dataPath   = key => path.join(DATA_DIR,         FILES[key]);
const publicPath = key => path.join(FRONTEND_DATA_DIR, FILES[key]);

// ── JSON helpers ──────────────────────────────────────────────────────────────
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

// ── Summary helper ────────────────────────────────────────────────────────────
function readSummary(key) {
  return readJson(dataPath(key), {});
}

// ── Auth middleware ──────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.sendStatus(401);
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// ── Auth routes ───────────────────────────────────────────────────────────────
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

// ── Model summary & recalibrate ───────────────────────────────────────────────
app.get('/api/model/summary', requireAuth, (req, res) => {
  try {
    const summary = readSummary('predicted');
    res.json(summary);
  } catch (err) {
    console.error('Error loading model summary:', err);
    res.status(500).json({ error: 'Failed to load model summary' });
  }
});

app.post('/api/model/recalibrate', requireAuth, (req, res) => {
  // kick off your Python training script
  exec(
    `${PYTHON_CMD} train_model.py --episodes=200`,
    { cwd: __dirname },
    (err, stdout, stderr) => {
      if (err) {
        console.error('⛔ Model training failed:', stderr);
        return res.status(500).json({
          error: 'Model training failed',
          details: stderr.slice(0, 200)  // first 200 chars
        });
      }

      // once training is done, read the newly‐written predicted.json
      try {
        const summary = readSummary('predicted');
        summary.lastCalibrated = new Date().toISOString();
        // persist that timestamp if you like
        syncJson('predicted', summary);
        return res.json(summary);
      } catch (e) {
        console.error('⛔ Failed to load new summary:', e);
        return res.status(500).json({
          error: 'Failed to load model summary after training'
        });
      }
    }
  );
});
// --------------------------count of ngo, rest------------------------------------
app.get('/api/stats/users', async (req, res) => {
  try {
    const [ngoCount, restaurantCount] = await Promise.all([
      prisma.user.count({ where: { role: 'NGO' } }),
      prisma.user.count({ where: { role: 'RESTAURANT' } })
    ])
    const allReqs = readJson(dataPath('requests'), [])
    const accepted = allReqs.filter(r => r.status === 'accepted')
    const mealsDonated = accepted.length
    const foodSaved = accepted.reduce((sum, r) => sum + parseInt(r.quantity, 10), 0)
    res.json({ ngos: ngoCount, restaurants: restaurantCount, mealsDonated, foodSaved })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats' })
  }
})


// ---------------------dashboard summary stats---------------------
app.get('/api/stats/dashboard', async (req, res) => {
  try {
    const activePartners = await prisma.user.count({
      where: { role: 'RESTAURANT' }
    })

    const allReqs = readJson(dataPath('requests'), [])

    const upcomingPickups = allReqs.filter(r => r.status === 'pending').length

    const requestsFulfilled = allReqs.filter(r => r.status === 'accepted').length

    const totalFoodSaved = allReqs
      .filter(r => r.status === 'accepted')
      .reduce((sum, r) => sum + (r.quantity ? parseInt(r.quantity, 10) : 0), 0)

    res.json({ activePartners, upcomingPickups, requestsFulfilled, totalFoodSaved })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load dashboard stats' })
  }
})


// ── Time-series helpers ────────────────────────────────────────────────────────
function getSeries(period) {
  const all = readJson(dataPath('modelData'));
  all.sort((a, b) => new Date(a.date) - new Date(b.date));
  const days = period === 'monthly' ? 30 : 7;
  return all.slice(-days).map(day => ({
    date:           day.date,
    actual:         day.items.reduce((s,i)=>s+(i.totalPlates||0),0),
    actualEarning:  parseFloat(day.items.reduce((s,i)=>s+(i.totalEarning||0),0).toFixed(2))
  }));
}

// ── Actual vs Predicted endpoints ─────────────────────────────────────────────
app.get('/api/dataformodel/:period', requireAuth, (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) return res.status(400).json({ error: 'Invalid period' });
  res.json(getSeries(p));
});

app.get('/api/predicted/:period', requireAuth, (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) return res.status(400).json({ error: 'Invalid period' });
  const series = getSeries(p).map(d => ({
    date: d.date,
    predicted: d.actual,
    predictedEarning: d.actualEarning
  }));
  const summary = readSummary('predicted');
  res.json({ epsilon: summary.epsilon || 0, series });
});

// ── Weekly predictions endpoint ────────────────────────────────────────────────
app.get('/api/predicted/weekly', requireAuth, (req, res) => {
  try {
    const raw = readJson(dataPath('predictedWeekly'), {});
    res.json(raw);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load weekly predictions' });
  }
});

// ── Metrics endpoints ─────────────────────────────────────────────────────────
app.get('/api/metrics/weekly', requireAuth, (req, res) => {
  res.json(readSummary('metricsWeekly'));
});
app.get('/api/metrics/monthly', requireAuth, (req, res) => {
  res.json(readSummary('metricsMonthly'));
});

// ── Servings endpoints ────────────────────────────────────────────────────────
app.get('/api/servings', requireAuth, (req, res) => {
  const all      = readJson(dataPath('today'), []);
  const todayStr = new Date().toISOString().split('T')[0];
  let filtered   = all.filter(s => s.date === todayStr);
  let needsSave  = false;

  filtered = filtered.map(s => {
    if (!s.id) {
      s.id = Date.now().toString() + Math.random().toString(36).slice(2,6);
      needsSave = true;
    }
    return s;
  });

  if (needsSave) writeJson(dataPath('today'), filtered);
  writeJson(publicPath('today'), filtered);
  res.json(filtered);
});

app.post('/api/servings', requireAuth, (req, res) => {
  const arr   = readJson(dataPath('today'), []);
  const today = new Date().toISOString().split('T')[0];
  const item  = { id: Date.now().toString(), date: today, ...req.body };
  arr.push(item);
  syncJson('today', arr);
  res.json({ message: 'Added', item });
});

app.delete('/api/servings/:id', requireAuth, (req, res) => {
  const all      = readJson(dataPath('today'), []);
  const filtered = all.filter(s => s.id !== req.params.id);
  syncJson('today', filtered);
  res.json({ message: 'Deleted' });
});

// ── Feedback & reviews ────────────────────────────────────────────────────────
app.post('/api/feedback', (req, res) => {
  try {
    const fp = dataPath('feedback');
    const newFb = { ...req.body, id: Date.now().toString(), submittedAt: new Date().toISOString() };
    const existing = readJson(fp, []);
    existing.push(newFb);
    writeJson(fp, existing);
    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to save feedback' });
  }
});

app.get('/api/feedback', (req, res) => {
  res.json(readJson(dataPath('feedback'), []));
});

app.get('/api/reviews', (req, res) => {
  try {
    const raw = readJson(dataPath('feedback'), []);
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load reviews.' });
  }
});

// ── Food upload & reservation ────────────────────────────────────────────────
app.post('/api/food', requireAuth, (req, res) => {
  const list = readJson(dataPath('foodItems'), []);
  const item = { ...req.body, id: Date.now().toString(), status: 'available', createdAt: new Date().toISOString() };
  list.push(item);
  syncJson('foodItems', list);
  res.json({ message: 'Food added', item });
});

app.get('/api/available-food', requireAuth, (req, res) => {
  const all = readJson(dataPath('foodItems'), []);
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2*60*60*1000);
  const todayStr    = now.toISOString().split('T')[0];

  all.forEach(i => { if (!i.createdAt) i.createdAt = now.toISOString(); });
  writeJson(dataPath('foodItems'), all);

  const fresh = all.filter(i =>
    i.status === 'available' &&
    new Date(i.createdAt) >= twoHoursAgo &&
    i.createdAt.split('T')[0] === todayStr
  );

  syncJson('foodItems', fresh);
  res.json(fresh);
});

app.post('/api/reserve-food', requireAuth, (req, res) => {
  const { id } = req.body;
  const all    = readJson(dataPath('foodItems'), []);
  const idx    = all.findIndex(i => i.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });

  all[idx].status     = 'reserved';
  all[idx].reservedAt = new Date().toISOString();
  syncJson('foodItems', all);

  const reserved = readJson(dataPath('reserved'), []);
  reserved.push(all[idx]);
  syncJson('reserved', reserved);

  res.json({ success: true });
});

// ── Cart & requests ──────────────────────────────────────────────────────────
app.post('/api/save-cart', requireAuth, (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });

  syncJson('cart', items);

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

app.get('/api/requests', requireAuth, (req, res) => {
  res.json(readJson(dataPath('requests'), []));
});

app.post('/api/requests/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const all = readJson(dataPath('requests'), []);
  const idx = all.findIndex(r => String(r.id) === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  all[idx].status = status;
  syncJson('requests', all);
  res.json({ message: 'Status updated', id: req.params.id, status });
});

app.delete('/api/cart', requireAuth, (req, res) => {
  syncJson('cart', []);
  res.json({ message: 'Cart cleared' });
});
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

// ── Archive & reset ───────────────────────────────────────────────────────────
app.post('/api/archive', requireAuth, (req, res) => {
  const arr       = readJson(dataPath('today'), []);
  const dateStamp = new Date().toISOString().split('T')[0];
  const md        = readJson(dataPath('modelData'), []);
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

// ── History from predicted.json ──────────────────────────────────────────────
app.get('/api/predictions', (req, res) => {
  try {
    const data    = readJson(dataPath('predicted'), {});
    const dishes  = Array.isArray(data.dishes) ? data.dishes : [];
    const q_vals  = Array.isArray(data.q_values) ? data.q_values : [];
    const counts  = Array.isArray(data.counts)   ? data.counts   : [];
    const best    = data.best;

    const predictions = dishes.map((dish, i) => ({
      dishName: dish,
      qValue:   parseFloat((q_vals[i] || 0).toFixed(2)),
      count:    counts[i] || 0,
      isBest:   dish === best
    }));

    res.json(predictions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load predictions' });
  }
});
// --------------------------History from requests.json----------------------------
app.get('/api/requests', (req, res) => {
  try {
    const file = dataPath('requests'); // should point to requests.json
    const data = readJson(file);
    res.json(data);
  } catch (err) {
    console.error('Error reading requests.json:', err);
    res.status(500).json({ error: 'Failed to load requests data' });
  }
});

// ---------------------------------------------------------------------------
// ── Events endpoints ───────────────────────────────────────────────────────────
app.get('/api/events', requireAuth, (req, res) => {
  const all      = readJson(dataPath('events'), []);
  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = all.filter(e => e.date >= todayStr);
  syncJson('events', upcoming);
  res.json(upcoming);
});
app.post('/api/events', requireAuth, (req, res) => {
  const evts = readJson(dataPath('events'), []);
  evts.push(req.body);
  syncJson('events', evts);
  res.json({ message: 'Event added' });
});
app.delete('/api/events/:id', requireAuth, (req, res) => {
  const filtered = readJson(dataPath('events'), []).filter(e => e.id !== req.params.id);
  syncJson('events', filtered);
  res.json({ message: 'Event deleted' });
});

// ── Cron job: nightly archive & retrain ───────────────────────────────────────
cron.schedule('0 0 * * *', () => {
  try {
    // Archive today’s data
    const arr   = readJson(dataPath('today'), []);
    const stamp = new Date().toISOString().split('T')[0];
    const md    = readJson(dataPath('modelData'), []);
    const idx   = md.findIndex(d => d.date === stamp);
    if (idx >= 0) md[idx].items = arr;
    else          md.push({ date: stamp, items: arr });

    md.sort((a,b) => new Date(a.date) - new Date(b.date));
    syncJson('modelData', md);

    // Reset today’s servings
    writeJson(dataPath('today'), []);
    writeJson(publicPath('today'), []);

    // Retrain model
    exec(`${PYTHON_CMD} train_model.py --episodes=200`, { cwd: __dirname });
  } catch (e) {
    console.error('Cron job failed', e);
  }
});
// ── Partnership requests ──────────────────────────────────────────────────────
app.post('/api/partnership-requests', requireAuth, async (req, res) => {
  const { restaurantId } = req.body;
  const ngoId = req.user.userId;

  const existing = await prisma.partnershipRequest.findFirst({
    where: { ngoId, restaurantId }
  });
  if (existing) return res.status(409).json({ error: 'Already requested.' });

  const request = await prisma.partnershipRequest.create({
    data: { ngoId, restaurantId }
  });
  res.json(request);
});

app.get('/api/partnership-requests/outgoing', requireAuth, async (req, res) => {
  const ngoId = req.user.userId;
  const requests = await prisma.partnershipRequest.findMany({
    where: { ngoId },
    include: { restaurant: true }
  });
  res.json(requests);
});

app.get(
  '/api/restaurants',
  requireAuth,
  async (req, res) => {
    try {
      // 1) fetch only the columns you’ve defined in schema.prisma
      const raw = await prisma.user.findMany({
        where: { role: 'RESTAURANT' },
        select: {
          id:             true,
          restaurantName: true,
          email:          true,
          gstNumber:      true,
          createdAt:      true,
          updatedAt:      true
        }
      });

      // 2) map into the shape your front-end expects
      const list = raw.map(r => ({
        id:             r.id,
        name:           r.restaurantName,
        email:          r.email,
        gstNumber:      r.gstNumber || '',
        joinedDate:     r.createdAt.toISOString(),
        // everything else is still mock/default:
        address:        '',
        phone:          '',
        cuisine:        '',
        status:         'Active',
        lastPickup:     '-',
        totalDonations: 0,
        totalPickups:   0,
        rating:         0,
        reliability:    0
      }));

      return res.json(list);
    } catch (err) {
      console.error('Failed to load restaurants', err);
      return res.status(500).json({ error: 'Unable to fetch restaurants' });
    }
  }
);
// ── Static files & SPA fallback ────────────────────────────────────────────────
app.use('/data', express.static(FRONTEND_DATA_DIR));
const FRONTEND_BUILD = path.join(__dirname, '../frontend/dist');
app.use(express.static(FRONTEND_BUILD));
app.get('*', (_, res) => {
  res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
});

// ── Start server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
