import { IUser } from "@codrjs/models";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload & IUser;
    }
  }
}
