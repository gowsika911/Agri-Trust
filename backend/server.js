const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── CORS Configuration ─────────────────────────────────────
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '*',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Database Connection ────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// ── Routes ─────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const supplyRoutes = require('./routes/supplyRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/supply', supplyRoutes);
app.use('/api/blockchain', blockchainRoutes);

// ── Health Check ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🌾 Agri Trust API is running!',
    version: '1.0.0',
    status: 'healthy',
    environment: process.env.NODE_ENV,
    routes: {
      auth: '/api/auth',
      crops: '/api/crops',
      supply: '/api/supply',
      blockchain: '/api/blockchain',
    },
  });
});

// ── 404 Handler ────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});