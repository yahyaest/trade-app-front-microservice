import pino, { Logger } from "pino";

export const logger: Logger =
  process.env["NODE_ENV"] === "production"
    ? // JSON in production
      // pino({ level: "warn" })
      pino({
        transport: {
          targets: [
            {
              target: "pino-pretty",
              options: {
                colorize: true,
                destination: "./logs/output.log",
                mkdir: true,
              },
            },
            {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
            },
          ],
        },
        level: "debug",
      })
    : // Pretty print in development
      pino({
        transport: {
          targets: [
            {
              target: "pino-pretty",
              options: {
                colorize: true,
                destination: "./logs/output.log",
                mkdir: true,
              },
            },
            {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
            },
          ],
        },
        level: "debug",
      });
