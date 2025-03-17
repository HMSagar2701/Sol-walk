import express from 'express';
import { getFitbitAuthURL, fitbitCallbackHandler, getStepsFromFitbit } from '../controllers/fitbitController';

const router = express.Router();

router.get('/authorize', getFitbitAuthURL);
router.get('/callback', fitbitCallbackHandler);
router.get('/steps/:userId', getStepsFromFitbit);

export default router;