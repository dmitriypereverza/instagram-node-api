import mongoose, { Document, Schema } from "mongoose";

export interface IOperator extends Document {
  title: string
  code: string
}

const OperatorSchema = new Schema({
  title: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
});

export const Operator = mongoose.model<IOperator>('Operator', OperatorSchema);
