/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/api-error.response";
import { JWT, RedisService } from "../utils";
import { IUser } from "../interface";

declare module "fastify" {
  interface FastifyRequest {
    userInfo?: IUser;
  }
}

export async function commonMiddleWare(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const redis = RedisService.Instance;
    const unprotectedRoutes = ["auth", "documentation", "fevicon"];
    const exceptions = ["logout"];
    const splitted = request.url.split("/");
    const preFixer = splitted[2];
    const postFixer = splitted[3];
    if (unprotectedRoutes.includes(preFixer) && !exceptions.includes(postFixer)) {
      return;
    }
    const token =
      request.headers.authorization?.replace("Bearer ", "") ||
      request.cookies.accessToken;
    if (!token) {
      throw new ApiError(401, "Bad request");
    }
    const user = JWT.isAccessTokenValid<IUser>(token);
    if (!user) {
      throw new ApiError(401, "authentication failed");
    }
    const userInfo = await redis.getUser(user.email);
    request.userInfo = userInfo;
    return;
  } catch (error) {
    throw error;
  }
}
