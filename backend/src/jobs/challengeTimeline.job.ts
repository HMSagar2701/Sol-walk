import cron from 'node-cron';
import { GroupChallenge } from '../models/GroupChallenge';

export const challengeTimelineJob = cron.schedule('* * * * *', async () => {
  // Runs daily at 00:00 midnight
  console.log('⏰ Running daily challenge timeline cron job...');

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

    // TODO: Add your health API polling + winner calculation here
    // Example Pseudo-Logic:
    /*
      1. Fetch all participants
      2. Poll health API data (e.g., steps walked)
      3. Verify if they achieved daily goals
      4. Calculate winners or successful participants
      5. Trigger Solana USDT reward payout
    */

    // Example placeholder:
    // challenge.rewardStatus = 'DISTRIBUTED';
    // await challenge.save();
  }
}

console.log('✅ Daily challenge timeline cron job scheduled at 00:00');