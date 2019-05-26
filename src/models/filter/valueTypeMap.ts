import mongoose, { Document, Schema } from "mongoose";

import { IOperator, Operator } from "./operator";
import { IUserFilterField, UserFilterField } from "./userFilterField";
import { IInputType, InputType } from "./inputType";

export interface IValueTypeMap extends Document {
  userField: IUserFilterField
  operator: IOperator
  inputs: IInputType[]
  validation?: any
}

const ValueTypeMapSchema = new Schema({
  userField: { type: Schema.Types.ObjectId, required: true, ref: UserFilterField },
  operator: { type: Schema.Types.ObjectId, required: true, ref: Operator },
  inputs: [InputType],
  validation: { type: Map },
});

export const ValueTypeMap = mongoose.model<IValueTypeMap>('ValueTypeMap', ValueTypeMapSchema);
