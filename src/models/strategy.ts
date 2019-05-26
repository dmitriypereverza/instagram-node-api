import mongoose, { Document, Schema } from "mongoose";

import { ActionValue, IAction } from "./action";
import { IUser } from "./user";
import { ITarget } from "./target";

export interface IStrategy extends Document {
  owner: IUser['_id']
  target: ITarget['_id']
  actions: IAction['_id'][]
}
const strategySchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: Schema.Types.ObjectId, ref: 'Target', required: true },
  actions: [{ type: Schema.Types.ObjectId, ref: 'ActionValue', required: true }],
}, { timestamps: true });
export const Strategy = mongoose.model<IStrategy>('Strategy', strategySchema);




