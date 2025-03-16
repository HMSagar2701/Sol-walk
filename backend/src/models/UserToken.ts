import mongoose, { Schema, Document } from 'mongoose';

export interface IUserToken extends Document {
  userId: mongoose.Types.ObjectId;
  provider: 'GoogleFit' | 'Fitbit' | 'AppleHealth';
  accessToken: string;
  refreshToken: string;
  expiryDate: Date;
}

const UserTokenSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['GoogleFit', 'Fitbit', 'AppleHealth'], required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiryDate: { type: Date, required: true }
});

export default mongoose.model<IUserToken>('UserToken', UserTokenSchema);