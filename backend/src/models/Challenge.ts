import { Schema, model, Document } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description: string;
  stakeAmount: number;
  goal: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
}

const challengeSchema = new Schema<IChallenge>({
  title: { type: String, required: true },
  description: String,
  stakeAmount: { type: Number, required: true },
  goal: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default model<IChallenge>("Challenge", challengeSchema);
