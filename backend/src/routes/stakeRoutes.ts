import express from 'express';
import { getUserStake, stakeToGroupTreasury, } from '../controllers/stakeController';
import { groupDistributeRewards } from '../controllers/stakeController';

const router = express.Router();

router.post('/distribute-rewards', groupDistributeRewards);
router.post('/stake', stakeToGroupTreasury);
router.get('/', getUserStake);

export default router;