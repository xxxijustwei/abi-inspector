import pino, { Logger } from "pino";

export const logger: Logger =
  process.env.NODE_ENV === "production"
    ? pino({
        level: "warn",
      })
    : pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        },
        level: "debug",
      });
