// models/UserStake.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUserStake extends Document {
  userId: string;
  groupId: string;
  stakedAmount: number;
  treasuryWallet: string;
  createdAt: Date;
}

const UserStakeSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    groupId: { type: String, required: true },
    stakedAmount: { type: Number, required: true },
    treasuryWallet: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUserStake>('UserStake', UserStakeSchema);
