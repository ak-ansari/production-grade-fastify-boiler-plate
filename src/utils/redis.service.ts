/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from "fastify";
import { Server } from "../server/server";
import { IUser } from "../interface";
import { AuthService } from "../modules/Auth/service/auth.service";
import { User } from "../models";

export class RedisService {
  private _serverInstance: FastifyInstance;
  private static _instance: RedisService;
  constructor() {
    this._serverInstance = Server.Instance.serverInstance;
  }
  public static get Instance(): RedisService {
    return this._instance || (this._instance = new this());
  }

  public set<T>(key: string, value: T): Promise<T> {
    let valueToSet: string;
    if (typeof value !== "string") {
      valueToSet = JSON.stringify(value);
    } else {
      valueToSet = value;
    }
    return new Promise((resolve, reject) => {
      this._serverInstance.redis.set(key, valueToSet, (err, result) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
  }
  public get<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this._serverInstance.redis.get(key, (err, result) => {
        if (err) reject(err);
        else resolve(JSON.parse(result));
      });
    });
  }
  public delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._serverInstance.redis.del(key, (err, result) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
  public async getUser(email: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this._serverInstance.redis.get(email, async (err, value) => {
        try {
          if (err) {
            return reject(err);
          } else if (!value) {
            const user = await User.findOne({ email })
              .select("-passwords -refreshToken")
              .lean();
            await this.set(email, user);
            resolve(user);
          } else {
            resolve(JSON.parse(value));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
