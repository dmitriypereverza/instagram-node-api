import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  owner: IUser['_id']
  login: string
  password: string
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
