import { CallbackWithoutResultAndOptionalError, model } from "mongoose";
import { schemaBuilder } from "../utils/schema-builder.method";
import { IUser } from "../interface";
import { BcryptService } from "../utils/bcrypt.service";

const userSchema = schemaBuilder({
  userName: { type: "String", require: true, unique: true },
  email: { type: "String", require: true, unique: true },
  passwords: { type: "String", require: true },
  refreshToken: { type: "String", require: false },
  mobileNo: { type: "Number", require: true },
});

userSchema.pre(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (this.isModified("passwords")) {
      this.passwords = await BcryptService.hash(this.passwords);
    }
    next();
  }
);
export const User = model<IUser>("User", userSchema);
