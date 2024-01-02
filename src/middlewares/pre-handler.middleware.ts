import { FastifyReply, FastifyRequest } from "fastify";
import {isEmpty} from "lodash";

export const  preHandler = async(request: FastifyRequest, reply: FastifyReply): Promise<any>=>{
    // request.query = isEmpty(request.query) ? request.query : JSON.parse(request.query["params"])
}