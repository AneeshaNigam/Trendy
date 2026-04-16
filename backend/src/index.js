import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from '../config/passport.js';

import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import trendRoutes from './routes/trendRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import connectDB from '../config/db.js';
import { startJobs } from './jobs/collectorJob.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkeyboardcat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/search', searchRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start: wait for DB before launching server & jobs
const startServer = async () => {
  try {
    await connectDB();                       // ✅ DB ready first

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startJobs();                           // ✅ jobs start after DB is confirmed
    });
  } catch (err) {
    console.error('Fatal: could not start server —', err.message);
    process.exit(1);
  }
};

startServer();
