import type { OpenAPIV3_1 } from "openapi-types";

const ErrorSchema: OpenAPIV3_1.SchemaObject = {
  title: "Error Schema",
  allOf: [{ $ref: "#/components/schemas/GenericSchema" }],
  properties: {
    status: {
      type: "number",
      example: 500,
    },
  },
  required: ["status"]
};

export default ErrorSchema;
