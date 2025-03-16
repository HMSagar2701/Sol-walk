import cron from 'node-cron';
import { GroupChallenge } from '../models/GroupChallenge';

export const challengeTimelineJob = cron.schedule('0 0 * * *', async () => {
  // Runs every minute temporarily for testing
  console.log('⏰ Running challenge timeline cron job...');

  const today = new Date();

  try {
    // 1. Switch UPCOMING → ONGOING
    const ongoingChallenges = await GroupChallenge.updateMany(
      {
        challengeStatus: 'UPCOMING',
        startDate: { $lte: today },
      },
      { $set: { challengeStatus: 'ONGOING' } }
    );
    console.log(`✅ ${ongoingChallenges.modifiedCount} challenges marked as ONGOING`);

    // 2. Switch ONGOING → COMPLETED
    const completedChallenges = await GroupChallenge.updateMany(
      {
        challengeStatus: 'ONGOING',
        endDate: { $lte: today },
      },
      { $set: { challengeStatus: 'COMPLETED' } }
    );
    console.log(`✅ ${completedChallenges.modifiedCount} challenges marked as COMPLETED`);

    // 3. Handle Rewards
    await rewardHandlerForCompletedChallenges();

  } catch (err) {
    console.error('❌ Cron Job Error:', err);
  }
});

// Reward Distribution Logic
async function rewardHandlerForCompletedChallenges() {
  const today = new Date();

  const challenges = await GroupChallenge.find({
    challengeStatus: 'COMPLETED',
    endDate: { $lte: today }
  });

  for (const challenge of challenges) {
    console.log(`🎁 Processing rewards for Challenge ID: ${challenge._id}`);

    // TODO: You can implement your logic here.
    // Example (pseudo logic):
    /*
      - Fetch participants
      - Check their progress
      - Distribute rewards (simulate Solana USDT payout)
      - Update challenge with winner status
    */

    // Example of marking challenge as 'REWARDS_DISTRIBUTED'
    // challenge.rewardStatus = 'DISTRIBUTED';
    // await challenge.save();
  }
}
