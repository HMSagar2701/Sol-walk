import mongoose from 'mongoose';

const stakeTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupChallenge' },
  txHash: String,
  amount: Number,
  currency: String,
  vaultPDA: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('StakeTransaction', stakeTransactionSchema);