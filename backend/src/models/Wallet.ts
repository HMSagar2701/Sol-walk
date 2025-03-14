import { Schema, model, Document, Types } from "mongoose";

export interface IWallet extends Document {
  userId: Types.ObjectId;
  solanaAddress: string;
  balance: number;
}

const walletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  solanaAddress: { type: String, required: true },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export default model<IWallet>("Wallet", walletSchema);
