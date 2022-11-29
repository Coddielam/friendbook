import {
  Sequelize as TSequelize,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  Op,
} from "sequelize";
import { models } from "../";
import { CustomError } from "../../services/Error";
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id?: string;
  declare email: string;
  declare password: string;
  declare name: string;
  declare phone: number;
  declare profile_pic: string;
  declare company: string;

  static async findFriends(id: string) {
    try {
      return this.findOne({
        where: {
          id,
        },
        include: ["friends", "friendRequests"],
      });
    } catch (error) {
      throw new CustomError("Something went wrong when finding user friends", {
        error,
      });
    }
  }

  static async makeFriendRequest(id: string, friendId: string) {
    try {
      const user = await this.findOne({
        where: { id },
        include: "friendRequests",
      });
      if (!user) {
        throw new CustomError("User not found", { code: 400 });
      }
      const befriendTarget = await this.findOne({ where: { id: friendId } });
      if (!befriendTarget) {
        throw new CustomError("Friend not found", { code: 400 });
      }

      await this.sequelize?.models.FriendRequest.create({
        userId: user.id,
        befriendId: befriendTarget.id,
      });

      return user.reload();
    } catch (error: any) {
      throw new CustomError(
        error.message || "Failed to create friend request.",
        {
          code: error?.meta?.code || 500,
          error,
        }
      );
    }
  }

  static async acceptFriendRequest(userId: string, friendId: string) {
    try {
      const user = await this.findFriends(userId);
      if (!user) {
        throw new CustomError("User not found", { error: user, code: 400 });
      }
      const friend = await this.findOne({ where: { id: friendId } });
      if (!friend) {
        throw new CustomError("Friend not found", { error: user, code: 400 });
      }

      // clean up - remove request in FriendRequest
      const request = await models.FriendRequest.findOne({
        // where the request was made from the request user
        // and the befriend id is the current user
        where: {
          userId: friendId,
          befriendId: userId,
        },
      });
      if (!request) {
        throw new CustomError("Friend request does not exists", {});
      } else {
        request?.destroy();

        // 2 way relationship
        await this.sequelize?.models.UserFriends.create({
          UserId: userId,
          friendId,
        });
        await this.sequelize?.models.UserFriends.create({
          UserId: friendId,
          friendId: userId,
        });
      }

      return user.reload();
    } catch (error) {
      throw new CustomError("Failed to add friend", { code: 500, error });
    }
  }

  static async findNonFriends(userId: string) {
    try {
      // find all the firends of this user
      const result = await this.sequelize?.models.UserFriends.findAll({
        where: { [Op.or]: [{ UserId: userId }, { friendId: userId }] },
      });

      const ids = (result as unknown as {
        UserId: string;
        friendId: string;
      }[])!.reduce<string[]>((array, record) => {
        return [...array, record.UserId, record.friendId];
      }, []);
      const userFriendsIds = Array.from(new Set(ids));

      const nonFriends = await this.sequelize?.models.User.findAll({
        where: {
          id: {
            [Op.notIn]: [userId, ...userFriendsIds],
          },
        },
      });

      // find user requested friends
      const requestedFriends: Model<{ befriendId: string }>[] | undefined =
        await this.sequelize?.models.FriendRequest.findAll({
          where: {
            userId,
          },
        });
      const requestedFriendsIds = requestedFriends
        ? /* @ts-ignore */
          requestedFriends.map((user) => user.befriendId)
        : [];

      return nonFriends?.map((user) => ({
        ...user.dataValues,
        /* @ts-ignore */
        friendRequested: requestedFriendsIds.includes(user.id),
      }));
    } catch (error) {
      throw new CustomError("Something went wrong while getting users", {
        error,
        code: 500,
      });
    }
  }

  static async getFriendRequests(id: string) {
    // FIXME: change the following to use a JOIN
    // get friend requests sent to this user
    const friendRequests = await models.FriendRequest.findAll({
      where: {
        befriendId: id,
      },
    });
    // find all the users from the above id
    const requestedFriendUserIds = friendRequests?.map(
      (request) => request.dataValues.userId
    );
    const requestedUsers = await this.findAll({
      where: {
        id: { [Op.in]: requestedFriendUserIds },
      },
    });

    return requestedUsers;
  }
}

const defineUserModel = (sequelize: TSequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      profile_pic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Users",
      sequelize,
      defaultScope: { attributes: { exclude: ["password"] } },
    }
  );
  // all fields required except friends
  User.hasMany(sequelize.models.FriendRequest, {
    foreignKey: "userId",
    as: "friendRequests",
  });
  User.belongsToMany(User, { through: "UserFriends", as: "friends" });

  return User;
};

export default defineUserModel;
