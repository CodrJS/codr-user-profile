import { Operation } from "@dylanbulmer/openapi/types/Route";
import { R200 } from "@dylanbulmer/openapi/classes/responses";
import { Metadata } from "@codrjs/models";

export const GET: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  (_req, res) => {
    res.status(200).json(new Metadata());
  };

// 3.0 specification
GET.apiDoc = {
  description: "Get the server deployment info",
  tags: ["System"],
  responses: {
    "200": {
      description: R200.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/MetadataSchema",
          },
        },
      },
    },
  },
};
