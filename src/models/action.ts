import mongoose, { Document, Schema } from "mongoose";

export enum ActionType {
  LIKE_BY_INDEX = 'likeByIndex',
  WAIT = 'wait',
  COMMENT = 'comment',
  COMMENT_TEMPLATE = 'commentTemplate',
  WAIT_RANGE = 'waitRange',
  LIKE_RANGE = 'likesRange',
  FOLLOW = 'follow',
  UNFOLLOW = 'unfollow',
}

export interface IActionSettings extends Document {
  title: string
  inputType: string
  name: string
}
const actionSettingsSchema = new Schema({
  title: { type: String, required: true },
  inputType: { type: String, required: true },
  name: { type: String, required: true },
}, { timestamps: true });
export const ActionSettings = mongoose.model<IActionSettings>('ActionSettings', actionSettingsSchema);



export interface IAction extends Document {
  title: string
  actionType: ActionType
  actionSettings: IActionSettings[]
}
const actionSchema = new Schema({
  title: { type: String },
  actionType: { type: String },
  actionSettings: [{ type: Schema.Types.ObjectId, ref: 'ActionSettings' }]
}, { timestamps: true });
export const Action = mongoose.model<IAction>('Action', actionSchema);



export interface IActionValue extends Document {
  action: IAction['_id']
  settingsValues: object
}
const actionValueSchema = new Schema({
  action: { type: Schema.Types.ObjectId, ref: 'Action' },
  settingsValues: [{ type: Map, of: String }]
}, { timestamps: true });
export const ActionValue = mongoose.model<IActionValue>('ActionValue', actionValueSchema);


