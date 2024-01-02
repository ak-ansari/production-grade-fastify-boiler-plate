import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";
import { Server } from "../server/server";
// import { errorHandler } from "../middlewares/error-handler.middleware";
import { Msg } from "../common";

// logging will be formatted with user email login
export function asyncHandler(
  requestHandler: (
    request: FastifyRequest,
    reply: FastifyReply
  ) => Promise<void>,
  msgKey: string
): RouteHandlerMethod {
  const server = Server.Instance.serverInstance;
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const email = request.userInfo
      ? request.userInfo.email
      : `IP: ${request.ip}`;
    try {
      server.logger.info({ message: Msg[msgKey], email });
      await requestHandler(request, reply);
      server.logger.success({ message: `Successfully ${Msg[msgKey]}`, email });
    } catch (error) {
      server.logger.error({ message: `Error while ${Msg[msgKey]}`, email });
      throw error;
    }
  };
}
