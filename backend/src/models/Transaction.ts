import { Schema, model, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  amount: number;
  type: "stake" | "reward" | "forfeit";
  status: "pending" | "completed" | "failed";
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["stake", "reward", "forfeit"], required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
}, { timestamps: true });

export default model<ITransaction>("Transaction", transactionSchema);
