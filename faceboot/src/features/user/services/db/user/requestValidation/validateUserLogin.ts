import Joi from "joi";
import { InferAttributes } from "sequelize";
import { User } from "../../../../../../database/models/userModel";
import { CustomError } from "../../../../../../services/Error";
import baseUserSchema from "./baseUserSchema";

type TLoginUserSchema = Pick<InferAttributes<User>, "email" | "password">;

// making it all required
// const loginUserSchema = Joi.object<TLoginUserSchema, true>(baseUserSchema).fork(
//   Object.keys(baseUserSchema).filter(
//     (key) => key === "email" || key === "password"
//   ),
//   (schema) => schema.required()
// );
const loginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const validateCreateUserReq = async (user: Object) => {
  try {
    return await loginUserSchema.validateAsync(user, { allowUnknown: true });
  } catch (error) {
    throw new CustomError("Failed to validate login user request", {
      error,
      code: 400,
    });
  }
};

export default validateCreateUserReq;
