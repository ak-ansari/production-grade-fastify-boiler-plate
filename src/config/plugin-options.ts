import { FastifyRedisPluginOptions } from "@fastify/redis";
import { ENV } from "../ENV";
import { FastifyCorsOptions } from "@fastify/cors";
import { ServerOptions } from "socket.io";
import { FastifyCookieOptions } from "@fastify/cookie";
import { IEnv } from "../interface";

export class PluginOptions {
  private static _config: IEnv = ENV.Instance.Config;
  public static SWAGGER_OPTS: unknown = {
    swagger: {
      info: {
        title: "Fastify API",
        description: "Documentation for Fastify API",
        version: "1.0.0",
      },
      host: `localhost:${this._config.PORT}`, // Update with your actual server host
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      securityDefinitions: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
      securityDefinitionsPrefix: "Bearer ",
      security: [{ bearerAuth: [] }],
    },
    exposeRoute: true,
  };
  public static CORS_OPT: FastifyCorsOptions = {
    hook: "preHandler",
    origin: this._config.CORS_URL,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  };
  public static REDIS_OPTIONS: FastifyRedisPluginOptions = {
    host: this._config.REDIS_HOST,
    port: 6379,
  };
  public static SOCKET_OPTIONS: Partial<ServerOptions> = {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  };
  public static COOKIE_OPTIONS: FastifyCookieOptions = {
    secret: this._config.COOKIE_SECRET,
    hook: "onRequest",
  };
}
