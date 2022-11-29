import express, { Express } from "express";
import auth from "../../../middlewares/auth";
import userController from "../controllers/user.controller";
import multer from "multer";
import path from "path";

const mountUserRoute = (app: Express) => {
  const router = express.Router();
  const {
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
  } = userController;
  // register a user
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/upload/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });
  router.post("/register", upload.single("profile_pic"), registerUser);
  // login user
  router.post("/login", loginUser);
  router.put("/logout", logoutUser);
  // check user session
  router.get("/session", checkSession);
  // update a user's profile
  router.put(
    "/:id/updateProfile",
    auth,
    upload.single("profile_pic"),
    updateUser
  );
  // add friends to a user
  router.post("/:id/accpetFriendRequest", auth, acceptFriendRequest);
  // make friend request
  router.post("/:id/friendRequest", auth, friendRequest);
  // get the firends of a user
  router.get("/:id/friends", auth, getFriends);
  // get all the users
  // router.get("/users", auth, getNonFriends);
  router.get("/:id/nonFriendUsers", auth, getNonFriends);
  // get user
  router.get("/:id", auth, getUser);

  app.use("/user", router);
};

export default mountUserRoute;
