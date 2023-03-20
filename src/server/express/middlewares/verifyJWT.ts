import config from "@codrjs/config";
import { Error, IUser } from "@codrjs/models";
import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyJWT: RequestHandler = function verifyJWT(req, res, next) {
  const authorization = req.headers.authorization;
  if (authorization && /Bearer\s.+/g.test(authorization)) {
    const bearer = authorization.split(" ")[1];
    const token = jwt.verify(bearer, config.jwt.secret) as JwtPayload & IUser;
    req.user = token;
    next();
  } else {
    res
      .status(401)
      .json(new Error({ status: 401, message: "User is unauthorized." }));
  }
};

export default verifyJWT;
