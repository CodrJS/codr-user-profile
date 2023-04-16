import config from "@codrjs/config";
import { Error, IUser } from "@codrjs/models";
import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyJWT: RequestHandler = function verifyJWT(req, res, next) {
  // get authoriztion header
  const authorization = req.headers.authorization;

  // test if the header is valid
  if (authorization && /Bearer\s.+/g.test(authorization)) {
    // get bearer from header
    const bearer = authorization.split(" ")[1];

    try {
      // try to verify token
      const token = jwt.verify(bearer, config.jwt.secret, {
        issuer: config.jwt.issuer,
      }) as JwtPayload & IUser;

      // if successful, set user and pass request to the next operation.
      req.user = token;
      next();
    } catch (e) {
      // catch any errors and close connection.
      res.status(401).json(
        new Error({
          status: 401,
          message: "User token has either expired or is invalid.",
          details: e,
        })
      );
    }
  } else {
    // if header is invalid, close connection with status 401.
    res
      .status(401)
      .json(new Error({ status: 401, message: "User is unauthorized." }));
  }
};

export default verifyJWT;
