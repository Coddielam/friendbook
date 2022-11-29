import Joi from "joi";
import { InferAttributes } from "sequelize";
import { User } from "../../../../../../database/models/userModel";
import { CustomError } from "../../../../../../services/Error";
import baseUserSchema from "./baseUserSchema";

type TCreateUserSchema = Omit<InferAttributes<User>, "id" | "phone"> & {
  repeat_password: Pick<InferAttributes<User>, "password">;
  phone: string;
};

// making it all required
const createUserSchema = Joi.object<TCreateUserSchema, true>(
  baseUserSchema
).fork(Object.keys(baseUserSchema), (schema) => schema.required());

const validateCreateUserReq = async (user: Object) => {
  try {
    return createUserSchema.validateAsync(user);
  } catch (error) {
    throw new CustomError("Failed to validate create user request", { error });
  }
};

export default validateCreateUserReq;
