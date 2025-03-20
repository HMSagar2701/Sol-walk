import mongoose, { Document, Schema } from 'mongoose';

export type ChallengeStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';
export type StakeStatus = 'PENDING' | 'STAKED';

export interface IParticipant {
  userId: mongoose.Types.ObjectId;
  joinedAt: Date;
  stakeStatus: StakeStatus;
  progress: number;
}

export interface IGroupChallenge extends Document {
  potAmount?: number; // Optional, because some entries don’t have it
  groupId: mongoose.Types.ObjectId;
  challengeGoal: string;
  bidAmount: number;
  currency: 'USDT' | 'SOL';
  startDate: Date;
  endDate: Date;
  participants: IParticipant[];
  challengeStatus: ChallengeStatus;
  createdAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
    stakeStatus: { type: String, enum: ['PENDING', 'STAKED'], default: 'PENDING' },
    progress: { type: Number, default: 0 },
  },
  { _id: false }
);

const GroupChallengeSchema = new Schema<IGroupChallenge>(
  {
    potAmount: { type: Number, default: 0 }, // ✅ Now properly defined in schema, optional, defaults to 0
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    challengeGoal: { type: String, required: true },
    bidAmount: { type: Number, required: true },
    currency: { type: String, enum: ['USDT', 'SOL'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [ParticipantSchema],
    challengeStatus: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'COMPLETED'],
      default: 'UPCOMING',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const GroupChallenge = mongoose.model<IGroupChallenge>('GroupChallenge', GroupChallengeSchema);
