import mongoose, { Document, Schema } from "mongoose";

export interface IInputType extends Document {
  type: string
  options: string
}

const InputTypeSchema = new Schema({
  type: { type: String, required: true },
  options: { type: Map },
});

export const InputType = mongoose.model<IInputType>('InputType', InputTypeSchema);
