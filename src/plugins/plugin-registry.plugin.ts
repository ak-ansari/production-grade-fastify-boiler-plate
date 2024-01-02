import { FastifyInstance } from "fastify";
import { PluginOptions } from "../config";
import addHookPlugin from "./add-hook.plugin";
import prefixPlugin from "./prefix.plugin";
import logger from "../plugins/logger.plugin";
import fastifySwagger from "@fastify/swagger";
import authRoutes from "../modules/Auth/routes/auth.routes";
import cors from "@fastify/cors";
import { fastifyRedis } from "@fastify/redis";
import Blipp from "fastify-blipp";
import fastifyPlugin from "fastify-plugin";
// import fastifySocketIO from "fastify-socket.io";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCookie } from "@fastify/cookie";

export default fastifyPlugin(
  async (server: FastifyInstance) => {
    await server
      .register(addHookPlugin)
      .register(prefixPlugin, { prefix: "api" })
      .register(Blipp)
      .register(fastifySwagger, PluginOptions.SWAGGER_OPTS)
      .register(fastifySwaggerUi)
      .register(fastifyRedis, PluginOptions.REDIS_OPTIONS)
      .register(cors, PluginOptions.CORS_OPT)
      .register(logger)
      // .register(fastifySocketIO, PluginOptions.SOCKET_OPTIONS)
      .register(fastifyCookie, PluginOptions.COOKIE_OPTIONS)
      .register(authRoutes, {routePrefix: "/auth"})
      .after((err: unknown): void => {
        if (err) {
          server.log.error({ user: "" }, "Error in registering plugins");
          throw err;
        } else {
          server.log.info(
            { user: "" },
            "Registering of plugins completed successfully!"
          );
        }
      })
      .ready((err: unknown): void => {
        if (err) {
          server.log.error({ user: "" }, "Error in Executing  plugins");
          throw err;
        } else {
          server.log.info(
            { user: "" },
            "Execution of plugins completed successfully!"
          );
        }
      });
  }
);
