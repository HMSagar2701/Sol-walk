import express from 'express';
import { createGroupChallenge, joinGroupChallenge } from '../controllers/groupChallengeController';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create-group-challenge', authenticate, createGroupChallenge);
router.post('/join-group-challenge', authenticate, joinGroupChallenge);

export default router;