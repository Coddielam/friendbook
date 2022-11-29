import { RequestHandler } from "express";

const auth: RequestHandler = (req, res, next) => {
  if (req.session.email || req.session.userId) {
    next();
  } else {
    res.status(401).json({
      message: "Please authenticate",
    });
  }
};

export default auth;
