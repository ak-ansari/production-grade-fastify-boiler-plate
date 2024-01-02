import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { authMiddleWare, commonMiddleWare, errorHandler, preHandler } from "../middlewares";

export default fastifyPlugin((server: FastifyInstance, opts: FastifyPluginOptions, done:()=>void)=>{
    server
    .addHook("preHandler", preHandler)
    .addHook("preHandler", commonMiddleWare)
    .addHook("preHandler", authMiddleWare)
    .setErrorHandler(errorHandler);
    done();
});