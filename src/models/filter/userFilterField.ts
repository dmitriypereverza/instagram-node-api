import mongoose, { Document, Schema } from "mongoose";

export interface IUserFilterField extends Document {
  title: string
  code: string
}

const UserFilterFieldSchema = new Schema({
  title: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
});

export const UserFilterField = mongoose.model<IUserFilterField>('UserFilterField', UserFilterFieldSchema);
