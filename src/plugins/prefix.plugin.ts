import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(
  (server: FastifyInstance, opt: FastifyPluginOptions, done: () => void) => {
    server.addHook("onRoute", (route) => {
      route.url = `/${opt.prefix}${route.url}`;
    });
    done();
  }
);
