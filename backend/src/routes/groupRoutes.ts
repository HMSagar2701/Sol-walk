// src/routes/groupRoutes.ts
import express from 'express';
import {
  createGroup,
  getGroupById,
  acceptGroupInvite, // 👈 add this
} from '../controllers/groupController';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Routes
router.post('/create-group', authenticate, createGroup);
router.get('/:groupId', getGroupById);

// 👇 NEW: Sharable invite link route (protected - user must be logged in first)
//router.get('/invite/:groupId', authenticate, acceptGroupInvite);
router.get('/:groupId/accept-invite', authenticate, acceptGroupInvite);

export default router;
