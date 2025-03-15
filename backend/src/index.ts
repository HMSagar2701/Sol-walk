import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorHandler';
import challengeRoutes from './routes/challenge.route';

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS Middleware
app.use(cors());

// ✅ JSON Parsing Middleware
app.use(express.json());

// ✅ Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Health Check Route
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working!');
});

// ✅ Challenge Routes
app.use('/api/challenges', challengeRoutes);

// ✅ Render Health Check Route
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});


// ===============================================
// ✅ Google OAuth Routes
// ===============================================

// Start Google OAuth flow
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback URL
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (_req: Request, res: Response) => {
    res.redirect('/profile');
  }
);

// Logout route
app.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Protected route example
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/profile', ensureAuthenticated, (req: Request, res: Response) => {
  const user = req.user as { name?: string };
  res.send(`Welcome ${user?.name || 'User'}!`);
});

// ===============================================


// ✅ Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});