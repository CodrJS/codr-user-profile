import Logger, { transports } from "@codrjs/logger";

const ExpressLogger = Logger.add("Express", [
  new transports.File({
    filename: "logs/express/all.log",
  }),
  new transports.File({
    filename: "logs/express/http.log",
    level: "http",
  }),
]);
export default ExpressLogger;
