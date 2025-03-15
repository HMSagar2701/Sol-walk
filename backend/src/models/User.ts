import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId; // important!
  googleId: string;
  name: string;
  email: string;
  picture?: string;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
