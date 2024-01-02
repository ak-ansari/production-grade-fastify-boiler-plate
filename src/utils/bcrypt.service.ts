import bcrypt from "bcrypt";
import { ENV } from "../ENV";
export class BcryptService {
  private static _config = ENV.Instance.Config;
  public static async hash(passwords: string): Promise<string> {
    try {
      const hashed = await bcrypt.hash(passwords, this._config.SALT_ROUND);
      return hashed;
    } catch (error) {
      throw error;
    }
  }
  public static async isValid(
    passwords: string,
    hashed: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(passwords, hashed);
    } catch (error) {
      throw error;
    }
  }
}
