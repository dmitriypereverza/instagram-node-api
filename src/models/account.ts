import mongoose, { Document, Model, Schema } from "mongoose";

import { IUser } from "./user";

export interface IAccount extends Document {
  owner: IUser['_id']
  login: string
  password: string
}
export interface IAccountModel extends Model<IAccount> {
  findWithFilterByUser: (pipelines, userId: number) => any
  findOneWithFilterByUser: (pipelines, userId: number) => any
}

const accountSchema = new Schema({
  _id: Number,
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  login: { type: String, required: true },
  password: { type: String, required: true }
}, {  _id: false, timestamps: true });
const AutoIncrement = require('mongoose-sequence')(mongoose);
accountSchema.plugin(AutoIncrement, {id: 'account_seq'});

accountSchema.statics.findWithFilterByUser = async function(pipelines, userId: number) {
  return await this.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: "$owner" },
    { $match: { "owner._id": userId } },
    ...pipelines
  ]);
};

accountSchema.statics.findOneWithFilterByUser = async function(pipelines, userId: number) {
  const aggregate = await this.findWithFilterByUser(pipelines, userId);
  return aggregate.length
    ? aggregate[0]
    : null;
};

export const Account = mongoose.model<IAccount, IAccountModel>('Account', accountSchema);
