import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string
  password: string
}

const userSchema = new Schema({
  _id: Number,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { _id: false, timestamps: true });
const AutoIncrement = require('mongoose-sequence')(mongoose);
userSchema.plugin(AutoIncrement, {id: 'user_seq'});
export const User = mongoose.model<IUser>('User', userSchema);
