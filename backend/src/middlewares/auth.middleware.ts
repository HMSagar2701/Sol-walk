import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token missing. Please log in again.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (err: any) {
    console.log("🔐 Incoming JWT token:", token);

    if (err.name === 'TokenExpiredError') {
      const decodedExpired = jwt.decode(token, { complete: true });
      console.log("⏰ Token has expired.");
      console.log("🧾 Decoded expired token payload:", decodedExpired);
      res.status(401).json({ message: 'Token has expired. Please log in again.' });
    } else {
      console.log("❌ Invalid token error:", err.message);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
};
