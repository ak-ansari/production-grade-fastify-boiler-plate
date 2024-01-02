import {
  DoneFuncWithErrOrRes,
  FastifyInstance,
  FastifyPluginOptions,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import { AuthController } from "../controllers/auth.controller";
import { AuthRouteSchema } from "../schema/auth.route.schema";

export default fastifyPlugin(
  (
    server: FastifyInstance,
    opts: FastifyPluginOptions,
    next: DoneFuncWithErrOrRes
  ) => {
    const _authController = AuthController.Instance;
    const prefix = opts.routePrefix;
    /**
     * to register a user
     *
     * @access public
     * @since 1.0.0
     * @author Abdul Karim Ansari
     * @memberof AuthRoute
     * @url /register
     * @method POST
     */
    server.route({
      method: "POST",
      schema: AuthRouteSchema.CREATE_USER,
      url: `${prefix}/register`,
      handler: _authController.registerUser,
    });
    /**
     * to login a user
     *
     * @access public
     * @since 1.0.0
     * @author Abdul Karim Ansari
     * @memberof AuthRoute
     * @url /login
     * @method POST
     */
    server.route({
      method: "POST",
      schema: AuthRouteSchema.LOGIN_USER,
      url: `${prefix}/login`,
      handler: _authController.login,
    });
    /**
     * to refresh the access token by refresh token
     *
     * @access public
     * @since 1.0.0
     * @author Abdul Karim Ansari
     * @memberof AuthRoute
     * @url /refresh-token
     * @method POST
     */
    server.route({
      method: "POST",
      schema: AuthRouteSchema.REFRESH_TOKEN,
      url: `${prefix}/refresh-token`,
      handler: _authController.refreshToken,
    });
    /**
     * to logout the user
     *
     * @access public
     * @since 1.0.0
     * @author Abdul Karim Ansari
     * @memberof AuthRoute
     * @url /logout
     * @method POST
     */
    server.route({
      method: "POST",
      schema: AuthRouteSchema.LOGOUT,
      url: `${prefix}/logout`,
      handler: _authController.logout,
    });
    next();
  }
);
