import { Router } from 'express';
import { createChallenge, getChallenges } from '../controllers/challenge.controller';

const router = Router();

router.post('/', createChallenge);
router.get('/', getChallenges);

export default router;
