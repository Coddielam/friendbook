import { DataTypes, Sequelize } from "sequelize";

const defineFriendRequestModel = (sequelize: Sequelize) => {
  const FriendRequest = sequelize.define("FriendRequest", {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // the user that this wants to make friends with
    befriendId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });
  return FriendRequest;
};

export default defineFriendRequestModel;
