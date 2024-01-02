import dotenv from "dotenv";
import { IEnv } from "../interface";
import { devVariables } from "./environment.dev";
import { prodVariables } from "./environment.prod";

export class ENV {
  private static _instance: ENV;
  private _config: IEnv;
  constructor() {
    dotenv.config();
    this.configureEnv();
  }

  private configureEnv(): IEnv {
    const {
      ACCESS_TOKEN_EXPIRY,
      REFRESH_TOKEN_EXPIRY,
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      MONGO_PASS,
      MONGO_USER_NAME,
      ENCRYPTION_KEY,
      SALT_ROUND,
      COOKIE_SECRET,
      PORT,
    } = process.env as unknown as IEnv;
    const node_env = process.env.NODE_ENV;
    let ENV_OBJ = devVariables;
    switch (node_env) {
      case "dev":
        ENV_OBJ = devVariables;
        break;
      case "prod":
        ENV_OBJ = prodVariables;
        break;
      default:
        ENV_OBJ = devVariables;
        break;
    }
    this._config = {
      ...ENV_OBJ,
      ACCESS_TOKEN_EXPIRY,
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_EXPIRY,
      REFRESH_TOKEN_KEY,
      MONGO_PASS,
      MONGO_USER_NAME,
      ENCRYPTION_KEY,
      SALT_ROUND: Number(SALT_ROUND),
      COOKIE_SECRET,
      PORT,
    };
    return this._config;
  }
  public static get Instance(): ENV {
    return this._instance || (this._instance = new this());
  }
  public get Config(): IEnv {
    return this._config || this.configureEnv();
  }
}
