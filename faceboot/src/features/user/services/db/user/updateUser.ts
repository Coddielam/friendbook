import { InferAttributes } from "sequelize";
import { models } from "../../../../../database";
import { User } from "../../../../../database/models/userModel";
import { CustomError } from "../../../../../services/Error";

const updateUserInDb = async (id: string, newValues: InferAttributes<User>) => {
  try {
    return models.User.unscoped().update(newValues, {
      where: {
        id,
      },
      returning: true,
    });
  } catch (error) {
    throw new CustomError("Failed to update user in db.", { error });
  }
};

export default updateUserInDb;
