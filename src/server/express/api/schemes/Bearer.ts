import { OpenAPIV3_1 } from "openapi-types";

const BearerScheme: OpenAPIV3_1.SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
};

export default BearerScheme;
