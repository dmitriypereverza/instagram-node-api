import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
});

mongoose.model('User', UserSchema);
