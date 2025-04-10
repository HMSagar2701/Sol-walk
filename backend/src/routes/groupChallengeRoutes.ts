import express from 'express';
import {
  createGroupChallenge,
  joinGroupChallenge,
  getChallengeStatus,
  getChallengesByGroupId,
} from '../controllers/groupChallengeController';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create-group-challenge', authenticate, createGroupChallenge);
router.post('/join-group-challenge', authenticate, joinGroupChallenge);
router.get('/status/:groupId/:challengeId', getChallengeStatus);
router.get('/challenges/:groupId', authenticate, getChallengesByGroupId);

export default router;
