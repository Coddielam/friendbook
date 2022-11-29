import { InferAttributes } from "sequelize";
import { models } from "../../../../../database";
import { User } from "../../../../../database/models/userModel";
import { CustomError } from "../../../../../services/Error";

export const createUser = async (user: InferAttributes<User>) => {
  try {
    const { email, password, name, phone, profile_pic, company } = user;
    const newUser = await models.User.create({
      email,
      password,
      name,
      phone,
      profile_pic,
      company,
    });
    return newUser;
  } catch (error) {
    throw new CustomError("Server error", {
      developerMsg: "Something went wrong when creating a user",
      error,
    });
  }
};
