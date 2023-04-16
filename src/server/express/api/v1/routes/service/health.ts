import { Operation } from "@dylanbulmer/openapi/types/Route";
import { ServiceHealth } from "@codrjs/health";
import { R200 } from "@dylanbulmer/openapi/classes/responses";

export const GET: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  (_req, res) => {
    res.status(200).json(ServiceHealth.getStatus());
  };

// 3.0 specification
GET.apiDoc = {
  description: "Check the server health",
  tags: ["System"],
  responses: {
    "200": {
      description: R200.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/HealthSchema",
          },
        },
      },
    },
  },
};
