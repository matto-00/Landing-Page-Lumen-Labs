require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
const leadsRouter = require('./routes/leads');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('OK');
});

app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS db_time');
    res.json({ ok: true, db_time: rows[0].db_time });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

if (!process.env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET no definido — /api/auth/login no funcionará');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
