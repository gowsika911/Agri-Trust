const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const supplyRoutes = require('./routes/supplyRoutes');


app.use('/api/supply', supplyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);

// Default Route
app.get('/', (req, res) => {
  res.json({
    message: '🌾 Agri Trust API is running!',
    version: '1.0.0',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});