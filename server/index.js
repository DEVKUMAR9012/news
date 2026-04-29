const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Set global timeout for all queries
require('mongoose').set('bufferTimeoutMS', 3000);

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // raised for development — lower to 10 in production
  message: { message: 'Too many attempts. Please try again in 15 minutes.' }
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120 // 120 requests per minute
});

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://localhost:61092',
  'http://localhost:8000',
  'http://127.0.0.1:61092',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:8000',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Development mode: allow all origins
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }
    // Production: check whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes
app.use(express.json());

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/user', generalLimiter, require('./routes/user'));
app.use('/api/news', generalLimiter, require('./routes/news'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Daily News Digest API is running 🚀' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
