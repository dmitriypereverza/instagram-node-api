import mongoose, { Document, Schema } from "mongoose";

import { IUser } from "./user";

export interface IAccount extends Document {
  owner: IUser['_id']
  login: string
  password: string
}

const accountSchema = new Schema({
  _id: Number,
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  login: { type: String, required: true },
  password: { type: String, required: true }
}, {  _id: false, timestamps: true });
const AutoIncrement = require('mongoose-sequence')(mongoose);
accountSchema.plugin(AutoIncrement, {id: 'account_seq'});

export const Account = mongoose.model<IAccount>('Account', accountSchema);
