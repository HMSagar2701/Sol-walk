import { Schema, model, Document, Types } from "mongoose";

export interface IProgress extends Document {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
  steps: number;
  completed: boolean;
}

const progressSchema = new Schema<IProgress>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", required: true },
  steps: { type: Number, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IProgress>("Progress", progressSchema);
