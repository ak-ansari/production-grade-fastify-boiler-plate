import jwt from "jsonwebtoken";
import { ENV } from "../ENV";
export class JWT {
  private static _config = ENV.Instance.Config;

  public static getAccessToken = (payload: Record<string, unknown>): string =>
    jwt.sign(payload, this._config.ACCESS_TOKEN_KEY, {
      expiresIn: this._config.ACCESS_TOKEN_EXPIRY,
    });
  public static getRefreshToken = (payload: Record<string, unknown>): string =>
    jwt.sign(payload, this._config.REFRESH_TOKEN_KEY, {
      expiresIn: this._config.REFRESH_TOKEN_EXPIRY,
    });
  public static isAccessTokenValid = <T>(token: string): T =>
    jwt.verify(token, this._config.ACCESS_TOKEN_KEY) as T;

  public static isRefreshTokenValid = <T>(token: string): T =>
    jwt.verify(token, this._config.REFRESH_TOKEN_KEY) as T;
}
