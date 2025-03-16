import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  txHash: string;
  amount: number;
  currency: 'USDT' | 'SOL';
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'GroupChallenge', required: true },
    txHash: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['USDT', 'SOL'], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;