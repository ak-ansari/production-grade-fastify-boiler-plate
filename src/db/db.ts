import { FastifyInstance } from "fastify";
import { ENV } from "../ENV/config-environment";
import { MONGO_CONFIG } from "../config";
import { IEnv } from "../interface/env.interface";
import mongoose from "mongoose";

export class DB{
    private static _config: IEnv;
    constructor(){
    }
    public static async connect(server: FastifyInstance):Promise<void> {
        try {
            await mongoose.connect(this.mongoURI,MONGO_CONFIG);
            server.logger.success(`connected to database : ${this._config.DB_NAME}`);
        } catch (error) {
            console.log(error);
            server.logger.error(`error while connecting to db`);
        }
        
    }
    private static get mongoURI(): string {
        this._config = ENV.Instance.Config;
        const {MONGO_URI, MONGO_PASS, MONGO_USER_NAME,DB_NAME} = this._config;
        const pass = encodeURIComponent(MONGO_PASS);
        const userName= encodeURIComponent(MONGO_USER_NAME);
        return MONGO_URI
        .replace("<USER_NAME>", userName)
        .replace("<PASSWORD>", pass)
        .replace("<DB_NAME>", DB_NAME);
    }
}