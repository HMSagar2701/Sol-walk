import express from 'express';
import { createGroup, inviteMember } from '../controllers/groupController';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create-group', authenticate, createGroup);
router.post('/invite-member', authenticate, inviteMember);

export default router;