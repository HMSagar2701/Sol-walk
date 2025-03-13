import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorHandler';
import challengeRoutes from './routes/challenge.route';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Root Route
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working!');
});

// Mount API Routes
app.use('/api/challenges', challengeRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
