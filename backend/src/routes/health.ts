import express from 'express';
import GroupDailyProgress from '../models/GroupDailyProgress';

const router = express.Router();

router.post('/daily-progress', async (req, res) => {
  try {
    const { userId, groupId, challengeId, date, steps, goalMet, source } = req.body;

    const progress = await GroupDailyProgress.findOneAndUpdate(
      { userId, groupId, challengeId, date: new Date(date) },
      { steps, goalMet, source },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
