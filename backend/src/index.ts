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

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middlewares
app.use(cors());
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

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
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