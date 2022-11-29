import { Sequelize } from "sequelize";
import defineUserModel from "./models/userModel";
import dotenv from "dotenv";
import defineFriendRequestModel from "./models/friendRequestModel";

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB!,
  process.env.POSTGRES_USERNAME!,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
  }
);

const FriendRequest = defineFriendRequestModel(sequelize);
const User = defineUserModel(sequelize);

export const models = {
  User,
  FriendRequest,
};

export default sequelize;
