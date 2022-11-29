import { models } from "../../../../../database";
import { CustomError } from "../../../../../services/Error";

const findUserById = async (id: string) => {
  try {
    return models.User.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new CustomError("Failed to find user.", { error });
  }
};

export default findUserById;
