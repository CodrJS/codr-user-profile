import { Error } from "@codrjs/models";
import { Operation } from "@dylanbulmer/openapi/types/Route";
import verifyJWT from "@/server/express/middlewares/verifyJWT";
import { ProfileUtility } from "@/utils/ProfileUtility";
import { R200, R401, R403 } from "@dylanbulmer/openapi/classes/responses";
import { Types } from "mongoose";

export const GET: Operation = [
  /* business middleware not expressible by OpenAPI documentation goes here */
  verifyJWT,
  (req, res) => {
    const util = new ProfileUtility();
    util
      .getByUserId(req.user, new Types.ObjectId(req.user.sub))
      .then(resp => res.status(200).json(resp))
      .catch((err: Error) => res.status(err.status).json(err));
  },
];

// 3.0 specification
GET.apiDoc = {
  description: "Get own profile from database.",
  tags: ["Self Management"],
  responses: {
    "200": {
      description: R200.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              details: {
                type: "object",
                properties: {
                  profile: {
                    $ref: "#/components/schemas/ProfileEntitySchema",
                  },
                },
              },
              message: {
                type: "string",
                examples: ["OK"],
              },
            },
          },
        },
      },
    },
    "401": {
      description: R401.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [401],
              },
              message: {
                type: "string",
                examples: ["Profile is unauthorized."],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
    "403": {
      description: R403.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [403],
              },
              message: {
                type: "string",
                examples: ["Profile is forbidden from reading this profile."],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
};
