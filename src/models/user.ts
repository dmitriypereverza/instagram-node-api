import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string
  password: string
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });
const AutoIncrement = require('mongoose-sequence')(mongoose);
userSchema.plugin(AutoIncrement, {inc_field: 'id'});
export const User = mongoose.model<IUser>('User', userSchema);
