import { models } from "../../../../../database";
import { CustomError } from "../../../../../services/Error";

const findUserByEmail = async (email: string) => {
  try {
    return models.User.findOne({
      where: {
        email,
      },
    });
  } catch (error) {
    throw new CustomError("Failed to find user.", { error });
  }
};

export default findUserByEmail;
