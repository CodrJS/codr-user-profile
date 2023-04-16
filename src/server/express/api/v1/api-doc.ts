import type { OpenAPIV3_1 } from "openapi-types";
import {
  R200,
  R201,
  R204,
  R400,
  R401,
  R403,
  R404,
  R418,
  R500,
  R503,
} from "@dylanbulmer/openapi/classes/responses";
import {
  BaseEntitySchema,
  ErrorSchema,
  GenericSchema,
  HealthSchema,
  ProfileEntitySchema,
  MetadataSchema,
} from "./schemas";
import { BearerScheme } from "./schemes";
import { OpenAPI } from "@codrjs/models";
import Config from "@codrjs/config";

const OpenAPIConfig = new OpenAPI();

const settings: OpenAPIV3_1.Document = {
  openapi: "3.1.0",

  // The servers property breaks all apis for some reason
  servers: OpenAPIConfig.servers,

  info: {
    version: Config.version ?? "Unknown",
    title: OpenAPIConfig.info.title,
    description: OpenAPIConfig.info.description,
    contact: {
      name: "Dylan Bulmer",
      url: "https://codrjs.com",
      email: "dylan@codrjs.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },

  // paths are derived from the routes directory, do not add them here.
  paths: {},

  components: {
    responses: {
      "200": R200,
      "201": R201,
      "204": R204,
      "400": R400,
      "401": R401,
      "403": R403,
      "404": R404,
      "418": R418,
      "500": R500,
      "503": R503,
    },
    schemas: {
      BaseEntitySchema,
      ErrorSchema,
      GenericSchema,
      HealthSchema,
      ProfileEntitySchema,
      MetadataSchema,
    },
    securitySchemes: {
      Bearer: BearerScheme,
    },
  },
};

export default settings;
