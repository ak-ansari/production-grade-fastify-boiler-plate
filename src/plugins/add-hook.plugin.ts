import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { commonMiddleWare, errorHandler, preHandler } from "../middlewares";

export default fastifyPlugin((server: FastifyInstance, opts: FastifyPluginOptions, done:()=>void)=>{
    server
    .addHook("preHandler", preHandler)
    .addHook("preHandler", commonMiddleWare)
    .setErrorHandler(errorHandler);
    done();
});