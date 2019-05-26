import { Typegoose, prop } from "typegoose";

class User extends Typegoose {
  @prop({ required: true, unique: true })
  username?: string;

  @prop({ required: true })
  password?: string;
}
const UserModel = new User().getModelForClass(User);

export type UserType = typeof UserModel;
export default UserModel;

