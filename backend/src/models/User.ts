import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  walletAddress: string;
  challenges: string[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  walletAddress: { type: String, required: true },
  challenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
}, { timestamps: true });

export default model<IUser>("User", userSchema);