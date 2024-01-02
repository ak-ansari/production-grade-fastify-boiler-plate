import { ILoginRes, IUser } from "../../../interface";
import { User } from "../../../models";
import { ApiError, RedisService } from "../../../utils";
import { BcryptService } from "../../../utils/bcrypt.service";
import { JWT } from "../../../utils/jwt.service";

export class AuthService {
  private static _instance: AuthService;
  private _redisService: RedisService;
  constructor() {
    this._redisService = RedisService.Instance;
  }

  /**
   * to get the service instance
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @returns { AuthService }
   */

  public static get Instance(): AuthService {
    return this._instance || (this._instance = new this());
  }
  /**
   * to register a user
   *
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @memberof AuthService
   * @param {IUser} user
   * @returns {Promise<ILoginRes>}
   */

  public async registerUser(user: IUser): Promise<ILoginRes> {
    try {
      const { userName, passwords, email, mobileNo } = user;
      // validation of require fields
      if (
        [userName, passwords, email].some(
          field => field?.trim() === "" || !field
        )
      ) {
        throw new ApiError(400, "All fields are required");
      }
      if (!mobileNo) {
        throw new ApiError(400, "All fields are required");
      }
      // validation of unique user name and email
      const isUserExists = await User.findOne({
        $or: [{ userName }, { passwords }, { mobileNo }],
      });
      if (isUserExists) {
        let msg = "this ";
        if (isUserExists.mobileNo === mobileNo) {
          msg += "mobile number, ";
        }
        if (isUserExists.email === email) {
          msg += "email, ";
        }
        if (isUserExists.userName === userName) {
          msg += "user name, ";
        }
        throw new ApiError(400, `${msg} are already registered`);
      }
      // create user
      const createdUser = await User.create(user);
      // get access token and refresh token
      const accessToken = JWT.getAccessToken({
        _id: createdUser._id,
        email: createdUser.email,
        username: createdUser.userName,
      });
      const refreshToken = JWT.getRefreshToken({ _id: createdUser._id });

      // remove pass and refresh token
      const updatedUser = await User.findByIdAndUpdate(createdUser._id, {
        $set: {
          createdBy: createdUser._id,
          updatedBy: createdUser._id,
          refreshToken: refreshToken,
        },
      }).select("-passwords -refreshToken");
      // set in redis
      await this._redisService.set(updatedUser.email, updatedUser);
      // return user
      return { user: updatedUser, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * to login a user
   *
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @memberof AuthService
   * @param {string} uniqueId
   * @param {string} passwords
   * @returns {Promise<ILoginRes>}
   */
  public async login(uniqueId: string, passwords: string): Promise<ILoginRes> {
    try {
      if (!(uniqueId || passwords) || uniqueId === "" || passwords === "") {
        throw new ApiError(400, "User credentials are required");
      }
      const isUser = await User.findOne({
        $or: [{ userName: uniqueId }, { email: uniqueId }],
      });
      if (!isUser) {
        throw new ApiError(400, "User does not exist");
      }
      const isPasswordCorrect = await BcryptService.isValid(
        passwords,
        isUser.passwords
      );
      if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid user credentials");
      }
      const accessToken = JWT.getAccessToken({
        _id: isUser._id,
        email: isUser.email,
        username: isUser.userName,
      });
      const refreshToken = JWT.getRefreshToken({ _id: isUser._id });
      const updatedUser = await User.findByIdAndUpdate(isUser._id, {
        $set: { refreshToken, updatedBy: isUser._id },
      }).select("-passwords -refreshToken");
      // set in redis
      await this._redisService.set(updatedUser.email, updatedUser);
      return { user: updatedUser, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * to refresh the access token by refresh token
   *
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @memberof AuthService
   * @param {string} token
   * @returns {Promise<ILoginRes>}
   */

  public async refreshToken(token: string): Promise<ILoginRes> {
    try {
      if (!token) {
        throw new ApiError(400, "Unauthorized request");
      }
      const isValid = JWT.isRefreshTokenValid<{ _id: string }>(token);
      if (!isValid) {
        throw new ApiError(400, "Unauthorized request");
      }
      const { userName, email, refreshToken, _id } = await User.findById(
        isValid._id
      );
      if (token !== refreshToken) {
        throw new ApiError(400, "Unauthorized request");
      }
      const accessToken = JWT.getAccessToken({
        _id,
        email,
        userName,
      });
      const newRefreshToken = JWT.getRefreshToken({ _id });
      const updatedUser = await User.findByIdAndUpdate(_id, {
        $set: { refreshToken: newRefreshToken, updatedBy: _id },
      }).select("-passwords -refreshToken");
      // set in redis
      await this._redisService.set(updatedUser.email, updatedUser);
      return { user: updatedUser, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw error;
    }
  }
  /**
   * to logout the user
   *
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @memberof AuthService
   * @returns {Promise<void>}
   */
  public async logout(_id: string): Promise<void> {
    try {
      if (!_id) return;
      const user = await User.findByIdAndUpdate(_id, {
        $set: { refreshToken: undefined, updatedBy: _id },
      });
      await this._redisService.delete(user.email);
      return;
    } catch (error) {
      throw error;
    }
  }
}
