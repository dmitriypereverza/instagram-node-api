import mongoose, { Document, Schema } from "mongoose";

import { IUser } from "./user";

export interface IAccount extends Document {
  owner: IUser['_id']
  login: string
  password: string
}
const accountSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });
export const Account = mongoose.model<IAccount>('Account', accountSchema);


