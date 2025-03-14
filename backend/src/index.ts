import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorHandler';
import challengeRoutes from './routes/challenge.route';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB connection
connectDB();

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working!');
});

// ✅ Route Mounting
app.use('/api/challenges', challengeRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// 🔥 Health Check Route for Render
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
