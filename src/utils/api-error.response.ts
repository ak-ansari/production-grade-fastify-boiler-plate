// import { errorHandler } from "../middlewares/error.middlewares.js";
/**
 * @description Common Error class to throw an error from anywhere.
 * The {@link errorHandler} middleware will catch this error at the central place and it will return an appropriate response to the client
 */
class ApiError extends Error {
    public data: any;
    public success: boolean;
  /**
   *
   * @param {number} statusCode
   * @param {string} message
   * @param {any[]} errors
   * @param {string} stack
   */
  constructor(
    public statusCode: number,
    public message = "Something went wrong",
    public errors: any[] = [],
    public stack: string = ""
  ) {
    super(message);
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
