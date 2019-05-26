import mongoose, { Document, Schema } from "mongoose";

enum TargetTypes {
  FOLLOWERS = 'followers',
  HASH_TAG = 'hashTag',
  GEO = 'geo',
  LIST = 'list',
}
export interface ITargetType extends Document {
  title: string
  code: TargetTypes
}
const targetTypeSchema = new Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
});
export const TargetType = mongoose.model<ITargetType>('TargetType', targetTypeSchema);



export interface ITarget extends Document {
  targetType: ITargetType
  list: string[]
  isCircle: boolean
  getPerOnce: number
}
const targetSchema = new Schema({
  targetType: { type: Schema.Types.ObjectId, ref: TargetType, required: true },
  list: [{ type: String, required: true }],
  isCircle: { type: Boolean },
  getPerOnce: { type: Number },
}, { timestamps: true });
export const Target = mongoose.model<ITarget>('Target', targetSchema);




