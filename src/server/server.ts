import { fastify, FastifyInstance } from "fastify";
import pluginRegistryPlugin from "../plugins/plugin-registry.plugin";
import { Msg } from "../common";
import { DB } from "../db/db";

export class Server {
  private _PORT: number;
  private _app: FastifyInstance;
  private static _instance: Server;
  constructor() {
    this._PORT = Number(process.env.PORT) || 8080;
  }
  public async connect(): Promise<FastifyInstance> {
    this._app = fastify();
    DB.connect(this._app);
    await this._app.register(pluginRegistryPlugin);

    this._app.listen({ port: this._PORT }, (err: Error, address: string) => {
      if (err) {
        this._app.logger.error(`Error while ${Msg.SERVER_START}`);
        this._app.logger.error(JSON.stringify(err.message));
        process.exit(1);
      }
      this._app.logger.info({
        message: `Successfully ${Msg.SERVER_START} ${address}`,
      });
      this._app.blipp();
      this._app.swagger();
    });
    return this._app;
  }

  public get serverInstance(): FastifyInstance {
    return this._app;
  }
  public static get Instance(): Server {
    return this._instance || (this._instance = new this());
  }
}
