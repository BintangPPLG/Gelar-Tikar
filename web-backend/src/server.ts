import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { testDbConnection } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRouter);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: '🎟️ Aurora Pulse Concert Ticketing API Server',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan internal server.' });
});

// Start Server & Test DB
app.listen(PORT, async () => {
  console.log(`🚀 [Aurora Pulse Backend]: Server running on http://localhost:${PORT}`);
  console.log(`📡 [API Base URL]: http://localhost:${PORT}/api`);
  await testDbConnection();
});
