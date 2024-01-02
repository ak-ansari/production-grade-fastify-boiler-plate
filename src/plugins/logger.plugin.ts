import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import winston from "winston";
import chalk from "chalk";
import moment from "moment";


// Define the custom log level
winston.addColors({
  success: "green",
});

// Add the custom level to the levels configuration
const levels = winston.config.syslog.levels;
levels.success = 7; // Choose a level value (suggested to be between debug and info)

declare module "winston"{
  interface Logger{
    success: winston.LeveledLogMethod
  }
}
declare module "fastify" {
  interface FastifyInstance {
    logger: winston.Logger;
  }
}

export default fastifyPlugin(
  (server: FastifyInstance, opts: FastifyPluginOptions, next: () => void) => {
    const today = moment().format("DD-MM-YYYY");
    const logger = winston.createLogger({
      levels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, email, error }) => {
          return `${chalk.blueBright(
            email ? email : ""
          )} > ${timestamp} ${getColouredLevel(level)}: ${message} ${error ? `>> ${error}` : "" }`;
        })
      ),
      transports: [
        new winston.transports.Console({level:"success"}), // Log to the console
        new winston.transports.File({
          filename: `logs/info/${today}-info.log`,
          level: "info",
        }), // Log to a file
        new winston.transports.File({
          filename: `logs/error/${today}-error.log`,
          level: "error",
        }), // Log to a file
        new winston.transports.File({
          filename: `logs/success/${today}-success.log`,
          level: "success",
        }), // Log to a file
        new winston.transports.File({
          filename: `logs/other/${today}-other.log`,
        }), // Log to a file
      ],
    });
    server.decorate("logger", logger);
    function getColouredLevel(level: string): string {
      let colouredLevel = chalk.green(level);
      switch (level) {
        case "info":
          colouredLevel = chalk.blue(level);
          break;
        case "error":
          colouredLevel = chalk.red(level);
          break;
        case "success":
          colouredLevel = chalk.green(level);
          break;
        default:
          colouredLevel = chalk.yellow(level);
          break;
      }
      return colouredLevel;
    }
    next();
  }
);
