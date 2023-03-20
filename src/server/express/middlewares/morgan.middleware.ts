import ExpressLogger from "../utils/logger";
import morgan, { StreamOptions } from "morgan";

const stream: StreamOptions = {
  // Use the http severity
  write: message => ExpressLogger.http(message.trim()),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan("common", { stream, skip });

export default morganMiddleware;
