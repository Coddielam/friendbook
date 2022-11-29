import Joi from "joi";
import { InferAttributes } from "sequelize";
import { User } from "../../../../../../database/models/userModel";
import { CustomError } from "../../../../../../services/Error";
import baseUserSchema from "./baseUserSchema";

type TUpdateUserSchema = Omit<InferAttributes<User>, "id" | "phone"> & {
  phone: string;
  repeat_password: string;
};

// making it all required
const updateUserSchema = Joi.object<TUpdateUserSchema, true>(
  baseUserSchema
).fork(Object.keys(baseUserSchema), (schema) => {
  return schema.optional();
});

const validateUpdateUserReq = async (reqBody: TUpdateUserSchema) => {
  try {
    if (!reqBody) {
      throw new Error("Empty profile");
    }
    // if trying to change password but repeat dont match
    if (reqBody.password && reqBody.password !== reqBody.repeat_password) {
      throw new CustomError(
        "Please make sure password and repeat password match.",
        {}
      );
    }

    return await updateUserSchema.validateAsync(reqBody);
  } catch (error: any) {
    throw new CustomError(
      error.message || "Failed to validate create user request",
      { error }
    );
  }
};

export default validateUpdateUserReq;
