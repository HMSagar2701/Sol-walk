import mongoose, { Document, Schema } from 'mongoose';

export interface IGroupDailyProgress extends Document {
  userId: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  date: Date;
  steps: number;
  goalMet: boolean;
  source: 'GoogleFit' | 'Fitbit' | 'AppleHealth';
}

const GroupDailyProgressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  challengeId: { type: Schema.Types.ObjectId, ref: 'GroupChallenge', required: true },
  date: { type: Date, required: true },
  steps: { type: Number, default: 0 },
  goalMet: { type: Boolean, default: false },
  source: { type: String, enum: ['GoogleFit', 'Fitbit', 'AppleHealth'], required: true },
});

export default mongoose.model<IGroupDailyProgress>('GroupDailyProgress', GroupDailyProgressSchema);