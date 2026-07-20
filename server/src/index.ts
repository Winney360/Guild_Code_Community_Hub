import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/comments', commentRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Guild Code backend is running!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});