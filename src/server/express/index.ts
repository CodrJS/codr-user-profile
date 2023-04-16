import { Error } from "@codrjs/models";
import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import config from "@codrjs/config";
import v1 from "./api/v1";
import morgan from "./middlewares/morgan.middleware";
import ExpressLogger from "./utils/logger";
import type { IncomingMessage, Server, ServerResponse } from "http";
import { ServiceHealth } from "@codrjs/health";

const app: Express = express();
const HOST = config.express.host || "0.0.0.0";
const PORT = config.express.port ? Number.parseInt(config.express.port) : 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan);

app.use("/v1", v1);

app.use(((err, req, res, next) => {
  // if headers are already sent, let express handler the error
  if (res.headersSent) {
    return next(err);
  }

  // if the path is for the API, have it handle the error
  if (req.path.startsWith("/v1")) {
    return v1.get("errorHandler")(err, req, res, next);
  }

  // if all fails, send the error to express
  return next(err);
}) as express.ErrorRequestHandler);

app.use((req, res, next) => {
  // catch 404 errors?

  // if the path is for API v1, have v1 handler the error
  if (req.path.startsWith("/v1")) {
    const err = new Error({ status: 404, message: `not found: ${req.path}` });
    return v1.get("errorHandler")(err, req, res, next);
  }
});

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

export const start = () => {
  server = app.listen(PORT, HOST, () => {
    ExpressLogger.info(`Express is starting on ${HOST}:${PORT}`);
    ServiceHealth.handleEvent("express", "connect");
  });
};

export const stop = () => {
  ExpressLogger.info(`Server is shutting down`);
  ServiceHealth.handleEvent("express", "disconnect");
  server.close();
};

export default app;
