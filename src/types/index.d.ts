import type { Types } from "@codrjs/models";

declare global {
  namespace Express {
    interface Request {
      user: Types.JwtPayload;
    }
  }
}
