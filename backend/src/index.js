import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import tasksRouter from './routes/tasks.js';
import lettersRouter from './routes/letters.js';
import rewriteRouter from './routes/rewrite.js';
import postsRouter from './routes/posts.js';
import voiceRouter from './routes/voice.js';
import historyRouter from './routes/history.js';

// Middleware
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-telegram-id', 'x-telegram-username', 'x-telegram-first-name']
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(authMiddleware);

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/letters', lettersRouter);
app.use('/api/rewrite', rewriteRouter);
app.use('/api/posts', postsRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/history', historyRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Text Automator API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 CORS enabled for: ${allowedOrigins.join(', ')}`);
});

export default app;
