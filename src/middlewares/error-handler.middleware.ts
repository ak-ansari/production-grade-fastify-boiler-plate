import mongoose from "mongoose";

import { ApiError } from "../utils/api-error.response";
import { FastifyReply, FastifyRequest } from "fastify";
import { Server } from "../server/server";

/**
 *
 * @param {Error | ApiError} err
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler = (
  err: ApiError | Error,
  req: FastifyRequest,
  res: FastifyReply
) => {
  let error = err;
  let message: string;
  const email = req.userInfo
      ? req.userInfo.email
      : `IP: ${req.ip}`;
  const server = Server.Instance.serverInstance;
  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    // if not
    // create a new ApiError instance to keep the consistency

    // assign an appropriate status code
    const statusCode =
      (error as ApiError).statusCode || error instanceof mongoose.Error
        ? 400
        : 500;
    if (error instanceof mongoose.Error) {
      if (error.message?.includes("user validation failed")) {
        message = `${Object.keys(error?.["errors"]).join(
          ","
        )} are already present`;
      }
    } else {
      message = error.message || "Something went wrong";
    }

    // set a message from native Error instance or a custom one
    error = new ApiError(
      statusCode,
      message,
      error?.["errors"] || [],
      err.stack
    );
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "dev" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };
  
  //   removeUnusedMulterImageFilesOnError(req);
  // Send error response
  server.logger.error({message: response.message, email, error: JSON.stringify(response)});
  return res.status((error as ApiError).statusCode).send(response);
};

export { errorHandler };
