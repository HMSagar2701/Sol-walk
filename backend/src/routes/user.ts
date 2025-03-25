import express from 'express';
import User from '../models/User';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// ✅ GET /api/user/:userId - Fetch a single user by ID
router.get('/:userId', authenticate, async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name email picture');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user); // ❌ Do not use `await` here
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ POST /api/user/members - Fetch multiple users by an array of IDs
router.post('/members', authenticate, async (req, res): Promise<void> => {
  try {
    const { memberIds } = req.body;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      res.status(400).json({ message: 'Invalid member IDs' });
      return;
    }

    const users = await User.find({ _id: { $in: memberIds } }).select('name email');
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
