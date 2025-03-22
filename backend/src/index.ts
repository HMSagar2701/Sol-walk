import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from './config/passport';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorHandler';
import jwt from 'jsonwebtoken';
import groupRoutes from './routes/groupRoutes';
import challengeRoute from './routes/groupChallengeRoutes';
import { challengeTimelineJob } from './jobs/challengeTimeline.job';
import healthRoutes from './routes/health';
import googleFitRoutes from './routes/googleFit';
import fitbitRoutes from './routes/fitbitRoutes';
import stakeRoutes from './routes/stakeRoutes';
import solanaRoutes from "./routes/solanaRoutes";

dotenv.config();
const app = express();

app.set('trust proxy', 1); // Trust the first proxy (Render, Vercel, etc.)

// ✅ Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.use(express.json());

// ✅ Initialize Passport
app.use(passport.initialize());

// ✅ Health Check Route
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working!');
});

// ✅ Challenge Routes
app.use('/api/group-challenges', challengeRoute);

// ✅ Group Routes
app.use('/api/group', groupRoutes);

// ✅ Render Health Check Route
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.use('/api/health', healthRoutes);

app.use('/api/googlefit', googleFitRoutes);

app.use('/api/fitbit', fitbitRoutes);

app.use('/api/stake', stakeRoutes);

app.use("/api/solana", solanaRoutes);

// ===============================================
// ✅ Google OAuth Routes with JWT
// ===============================================

// Start Google OAuth flow
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback - Generate JWT here
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    const user = req.user as any;

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?token=${token}&userId=${user._id}`;
    res.redirect(redirectUrl);
  }
);


// Start challenge lifecycle cron job
challengeTimelineJob.start();

// ✅ Logout route (optional, frontend can just discard JWT)
app.get('/logout', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// ✅ Example protected route
import { authenticate } from './middlewares/auth.middleware'
app.get('/profile', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).userId;
  res.status(200).json({ message: `Authenticated User ID: ${userId}` });
});

// ✅ Error Handling
app.use(notFound);
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});