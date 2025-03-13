import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Default Route
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working!');
});

// 🔥 Health Check Route for Render
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Start Server
const PORT: number = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
