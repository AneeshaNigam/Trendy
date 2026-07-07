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

// Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkeyboardcat',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
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

// 🚀 Proper server start with DB connection
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB(); // ✅ WAIT for DB connection

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      console.log("Initializing background jobs...");
      startJobs(); // ✅ runs AFTER DB is ready
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();