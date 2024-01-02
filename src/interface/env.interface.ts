export interface IEnv {
  readonly MONGO_URI: string;
  readonly MONGO_PASS: string;
  readonly MONGO_USER_NAME: string;
  readonly DB_NAME: string;
  readonly ENCRYPTION_KEY: string;
  readonly WEB_URL: string;
  readonly CORS_URL: string;
  readonly REDIS_HOST: string;
  readonly SALT_ROUND: number;
  readonly ACCESS_TOKEN_KEY: string;
  readonly REFRESH_TOKEN_KEY: string;
  readonly ACCESS_TOKEN_EXPIRY: string;
  readonly REFRESH_TOKEN_EXPIRY: string;
  readonly COOKIE_SECRET: string;
}
