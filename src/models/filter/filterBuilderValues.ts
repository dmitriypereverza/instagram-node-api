import mongoose, { Document, Schema } from "mongoose";

import { IUserFilterField, UserFilterField } from "./userFilterField";
import { IOperator, Operator } from "./operator";
import { IValueTypeMap, ValueTypeMap } from "./valueTypeMap";
import { IStrategy, Strategy } from "../strategy";

export interface IFilterBuilderValues extends Document {
  strategy: IStrategy
  userField: IUserFilterField
  operator: IOperator
  valueTypeMap: IValueTypeMap
  values: any
}

const FilterBuilderValuesSchema = new Schema({
  strategy: { type: Schema.Types.ObjectId, required: true, ref: Strategy },
  userField: { type: Schema.Types.ObjectId, required: true, ref: UserFilterField },
  operator: { type: Schema.Types.ObjectId, required: true, ref: Operator },
  valueTypeMap: { type: Schema.Types.ObjectId, required: true, ref: ValueTypeMap },
  values: { type: Map, required: true },
});

export const FilterBuilderValues = mongoose.model<IFilterBuilderValues>('FilterBuilderValues', FilterBuilderValuesSchema);
