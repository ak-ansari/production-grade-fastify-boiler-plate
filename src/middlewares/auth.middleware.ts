/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from "fastify";
import { IUser } from "../interface";
import { JWT } from "../utils";
import { decode } from "punycode";

export async function authMiddleWare(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const splitted = request.url.split("/");
    const authRoutes = ["register", "login", "refresh-token"];
    const preFixer = splitted[2];
    const postUrl = splitted[3];
    if (preFixer !== "auth" || !authRoutes.includes(postUrl)) {
      return;
    }
    if (postUrl === "refresh-token") {
      const token =
        request.cookies.refreshToken ||
        request.headers.authorization?.replace("Bearer ", "");
      if (token) {
        const decoded = JWT.isRefreshTokenValid<{ _id: string }>(token);
        if (decoded?._id) {
          request.userInfo = {
            email:
              `_id >>${decoded?._id}`,
          } as IUser;
          return;
        }
      }
    }
    request.userInfo = {
      email:
        request.body?.["uniqueId"] ||
        request.body?.["email"] ||
        `IP >>${request.ip}`
    } as IUser;
    return;
  } catch (error) {
    throw error;
  }
}
