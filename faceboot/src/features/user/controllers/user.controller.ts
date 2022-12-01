import { RequestHandler } from "express";
import { CustomError } from "../../../services/Error";
import { PasswordService } from "../../../services/Password";
import { createUser } from "../services/db/user/createUser";
import findUserById from "../services/db/user/findUserById";
import updateUserInDb from "../services/db/user/updateUser";
import validateCreateUserReq from "../services/db/user/requestValidation/validateCreateUserReq";
import validateUpdateUserReq from "../services/db/user/requestValidation/validateUpdateUserRequest";
import findUserByEmail from "../services/db/user/findUserByEmail";
import { models } from "../../../database";

const registerUser: RequestHandler = async (request, response) => {
  // request validation
  try {
    const valid = await validateCreateUserReq({
      ...request.body,
      profile_pic: request.file?.path,
    });

    if (!valid) {
      throw response.status(400).json({
        message: "Please provide all the information to register an account",
      });
    }
  } catch (error) {
    response.status(400).json({
      message: "Please provide all the information to register an account",
      error,
    });
    return;
  }

  // check if user already exists
  try {
    const userExists = await findUserByEmail(request.body.email);
    if (userExists) {
      response.status(400).json({ message: "Email already registered" });
      return;
    }
  } catch (error) {
    response.status(500).json("Something went wrong when checking email");
    return;
  }

  // build and save an instance of the User model
  try {
    const { password } = request.body;
    // hash the password
    const hashedPw = await PasswordService.hashPassword(password);
    const newUser = await createUser({
      ...request.body,
      profile_pic: request.file!.filename,
      password: hashedPw,
    });

    request.session.email = newUser.email;
    request.session.userId = newUser.id;
    request.session.profile_pic = newUser.profile_pic;
    request.session.friendRequests = [];

    response.status(200).json({ user: newUser });
  } catch (error) {
    response.status(500).json(error);
  }
};

const updateUser: RequestHandler = async (request, response) => {
  const { id } = request.params;

  try {
    const valid = await validateUpdateUserReq(request.body);
    if (!valid) {
      response.status(400).json({
        message: "Bad request",
        details: valid,
      });
    }
  } catch (error: any) {
    response.status(500).json({
      message:
        error.message ||
        "Something went wrong when validating new user profile.",
      error,
    });
    return;
  }

  try {
    const user = await findUserById(id);
    if (!user) {
      response.status(400).json({ message: `No user found with id ${id}.` });
      return;
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: (error as CustomError).message, details: { error } });
  }

  // setting new profile pic if new profile has been uploaded
  let newProfile = request.body;
  if (request.file && request.file.fieldname) {
    newProfile = { ...request.body, profile_pic: request.file!.filename };
  }
  // storing hash password if any
  if (request.body.password) {
    newProfile.password = await PasswordService.hashPassword(
      request.body.password
    );
  }

  try {
    const [rowsAffected, updatedUsers] = await updateUserInDb(id, newProfile);
    if (!rowsAffected) {
      response.status(204).json({
        message:
          "No updates has been performed. If an update should have happened, please double check request body.",
      });
    }
    request.session.profile_pic = updatedUsers[0].profile_pic;
    response.status(200).json({
      message: "User profile has been updated",
      user: updatedUsers[0],
      details: {
        rowsAffected,
      },
    });
  } catch (error) {
    response.status(500).json({
      message: "Something went wrong when updating user.",
      details: { error },
    });
  }
};

const acceptFriendRequest: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const { friendId } = request.body;

  try {
    const userProfile = await models.User.acceptFriendRequest(id, friendId);
    // update friend requests in session
    request.session.friendRequests = (await models.User.getFriendRequests(
      userProfile.id!
    )) as unknown as any;
    response
      .status(200)
      .json({ message: "Friend added.", details: { userProfile } });
  } catch (error: any) {
    response.status(error?.meta?.code || 500).json(error);
  }
};

const friendRequest: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const { friendId } = request.body;
  try {
    const userProfile = await models.User.makeFriendRequest(id, friendId);
    response
      .status(200)
      .json({ message: "Request sent.", user: { userProfile } });
  } catch (error: any) {
    response.status(error?.meta?.code || 500).json(error.message);
  }
};

const getFriends: RequestHandler = async (request, response) => {
  const { id } = request.params;
  try {
    const user = await models.User.findFriends(id);

    response.status(200).json({ user });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to get user friends.", details: { error } });
  }
};

const getUsers: RequestHandler = async (request, response) => {
  try {
    const users = await models.User.findAll();
    response.status(200).json({
      users: users,
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Something went wrong when getting all users." });
  }
};

const getNonFriends: RequestHandler = async (request, response) => {
  const { id } = request.params;
  try {
    const result = await models.User.findNonFriends(
      id,
      request.session.userId!
    );
    response.status(200).json(result);
  } catch (error: any) {
    response.status(error.meta.code || 500).json({
      message:
        error.message || "Something went wrong when getting other users.",
      error,
    });
  }
};

const loginUser: RequestHandler = async (request, response) => {
  const { email, password } = request.body;

  let user;
  try {
    // validate user login request body
    if (!email || !password) {
      throw new CustomError("Please login with your email and password", {
        code: 400,
      });
    }

    user = await models.User.unscoped().findOne({
      where: { email },
      include: ["friendRequests"],
    });
    if (!user) {
      throw new CustomError("User not found.", {
        code: 400,
        error: null,
      });
    }

    const pwMatch = await PasswordService.verifyPassword(
      password,
      user.password
    );
    if (!pwMatch) {
      throw new CustomError("Incorrect username / password", {
        code: 400,
        error: null,
      });
    }

    request.session.email = user.email;
    request.session.userId = user.id;
    request.session.profile_pic = user.profile_pic;
    // FIXME: better type
    request.session.friendRequests = (await models.User.getFriendRequests(
      user.id!
    )) as unknown as any;

    response.status(200).json({ user });
  } catch (error: any) {
    response.status(error?.meta?.code || 500).json({
      message: error.message || "Something went wrong when logging in user.",
      details: { error },
    });
  }
};

const checkSession: RequestHandler = async (request, response, next) => {
  if (request.session.email || request.session.userId) {
    response.status(200).json({
      userId: request.session.userId,
      profile_pic: request.session.profile_pic,
      friendRequests: request.session.friendRequests,
    });
  } else {
    response.status(403).json({ message: "Please log in" });
  }
};

const getUser: RequestHandler = async (request, response) => {
  const { id } = request.params;

  try {
    const user = await models.User.findFriends(id);
    const friendRequests = await models.User.getFriendRequests(id);
    const requestedAddFriend = friendRequests.some(
      (friendRequest) => friendRequest.id === request.session.userId
    );

    if (user) {
      response
        .status(200)
        .json({ user: { ...user.dataValues, requestedAddFriend } });
    } else {
      throw new CustomError("User not found", { code: 400 });
    }
  } catch (error: any) {
    response.status(error.meta.code || 500).json({
      message:
        error.message || "Something went wrong when retrieving user profile.",
      details: { error },
    });
  }
};

const logoutUser: RequestHandler = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Server error", error: err });
      }
    });
    res.status(204).end();
  } catch (error) {}
};

export default {
  registerUser,
  updateUser,
  acceptFriendRequest,
  friendRequest,
  getFriends,
  getNonFriends,
  getUsers,
  getUser,
  loginUser,
  logoutUser,
  checkSession,
};
