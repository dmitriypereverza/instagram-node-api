import mongoose, { Document, Schema } from "mongoose";

import { IUser } from "./user";

export interface IAccount extends Document {
  owner: IUser
  login: string
  password: string
}

const accountSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  login: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });
const AutoIncrement = require('mongoose-sequence')(mongoose);
accountSchema.plugin(AutoIncrement, {inc_field: 'id'});

export const Account = mongoose.model<IAccount>('Account', accountSchema);
