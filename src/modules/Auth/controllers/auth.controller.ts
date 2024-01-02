import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../../../utils";
import { AuthService } from "../service/auth.service";
import { IUser } from "../../../interface";
import { CookieSerializeOptions } from "@fastify/cookie";
import { ApiResponse } from "../../../utils/api.response";
import { Msg } from "../../../common";

export class AuthController {
  private static _instance: AuthController;
  private _authService: AuthService;
  private _setCookieOpts: CookieSerializeOptions;
  constructor() {
    this._authService = AuthService.Instance;
    this._setCookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
    };
  }

  /**
   * to get the service instance
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @returns { AuthController }
   */

  public static get Instance(): AuthController {
    return this._instance || (this._instance = new this());
  }

  /**
   * to register a new user
   *
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @memberof AuthController
   * @returns {RouteHandlerMethod}
   */
  public registerUser = asyncHandler(
    async (req: FastifyRequest, reply: FastifyReply) => {
      const user = req.body as IUser;
      const response = await this._authService.registerUser(user);
      reply
        .status(201)
        .setCookie("accessToken", response.accessToken, this._setCookieOpts)
        .setCookie("refreshToken", response.refreshToken, this._setCookieOpts)
        .send(new ApiResponse(201, response, `Successfully ${Msg.SIGN_UP}`));
    },
    "SIGN_UP"
  );
  /**
   * to login a new user
   *
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @memberof AuthController
   * @returns {RouteHandlerMethod}
   */
  public login = asyncHandler(
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { uniqueId, passwords } = req.body as {
        uniqueId: string;
        passwords: string;
      };
      const response = await this._authService.login(uniqueId, passwords);
      reply
        .status(201)
        .setCookie("accessToken", response.accessToken, this._setCookieOpts)
        .setCookie("refreshToken", response.refreshToken, this._setCookieOpts)
        .send(new ApiResponse(201, response, `Successfully ${Msg.LOGIN}`));
    },
    "LOGIN"
  );
  /**
   * to refresh the access token by refresh token
   *
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @memberof AuthController
   * @returns {RouteHandlerMethod}
   */
  public refreshToken = asyncHandler(
    async (req: FastifyRequest, reply: FastifyReply) => {
      const token =
        req.cookies.refreshToken ||
        req.headers.authorization?.replace("Bearer ", "");
      const response = await this._authService.refreshToken(token);
      reply
        .status(201)
        .setCookie("accessToken", response.accessToken, this._setCookieOpts)
        .setCookie("refreshToken", response.refreshToken, this._setCookieOpts)
        .send(
          new ApiResponse(
            201,
            response,
            `Successfully ${Msg.REFRESH_TOKEN}`,
            false
          )
        );
    },
    "REFRESH_TOKEN"
  );
  /**
   * to logout user
   *
   * @access public
   * @since 1.0.0
   * @author Abdul Karim Ansari
   * @memberof AuthController
   * @returns {RouteHandlerMethod}
   */
  public logout = asyncHandler(
    async (req: FastifyRequest, reply: FastifyReply) => {
      const user = req.userInfo;
      await this._authService.logout(user._id);
      reply
        .status(201)
        .clearCookie("accessToken", this._setCookieOpts)
        .clearCookie("refreshToken", this._setCookieOpts)
        .send(new ApiResponse(201, {}, `Successfully ${Msg.LOGOUT}`));
    },
    "LOGOUT"
  );
}
