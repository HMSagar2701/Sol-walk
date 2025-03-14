import { Router } from 'express';
import { createChallenge, getChallenges } from '../controllers/challenge.controller';

const router = Router();

router.get('/', getChallenges);
router.post('/', createChallenge);

export default router;