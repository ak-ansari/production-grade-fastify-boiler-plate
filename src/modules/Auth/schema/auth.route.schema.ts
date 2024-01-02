import { FastifySchema } from "fastify";

export class AuthRouteSchema {
  public static CREATE_USER: FastifySchema = {
    body: {
      type: "object",
      required: ["userName", "mobileNo", "email", "passwords"],
      properties: {
        userName: { type: "string" },
        mobileNo: { type: "number" },
        email: { type: "string", format: "email" },
        passwords: { type: "string" },
      },
    },
    tags: ["Auth"],
    description: "to register a user in DB",
    summary: "to validated and registered user in DB",
  };
  public static LOGIN_USER: FastifySchema = {
    body: {
      type: "object",
      required: ["uniqueId", "passwords"],
      properties: {
        uniqueId: { type: "string" },
        passwords: { type: "string" },
      }
    },
    tags: ["Auth"],
    description: "to login a user in DB",
    summary: "to validated and login the user",
  };
  public static REFRESH_TOKEN: FastifySchema = {
    tags: ["Auth"],
    description: "to refresh the access token by refresh token",
    summary: "to refresh the access token by refresh token",
  };
  public static LOGOUT: FastifySchema = {
    tags: ["Auth"],
    description: "to logout the user",
    summary: "to logout the user and clear the refresh token value in db",
  };
}
