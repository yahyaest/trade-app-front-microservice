import pino, { Logger } from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

// Helper function to get current date and time in YYYY-MM-DD_HH-MM-SS format
const getDateTimeString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
};

// Generate the current date-time string
const dateTimeString = getDateTimeString();

// Define the log file path with date and time
const logFilePath = `./logs/output_${dateTimeString}.log`;

const transportOptions = isDevelopment
  ? {
      transport: {
        targets: [
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
              destination: "./logs/output.log",
              mkdir: true,
            },
          },
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
            },
            level: "trace",
          },
        ],
      },
      level: "trace",
    }
  : {
      // Production configuration
      transport: {
        targets: [
          {
            target: "pino/file",
            options: {
              colorize: true,
              translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
              destination: `./logs/output_${dateTimeString}.log`,
              mkdir: true,
            },
            level: process.env.LOG_LEVEL || "info",
          },
          {
            target: "pino/file",
            options: {
              colorize: true,
              translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
            },
            level: process.env.LOG_LEVEL || "info",
          },
        ],
      },
      level: process.env.LOG_LEVEL || "info",
    };

const pinoParams = isDevelopment
  ? null
  : {
      timestamp: pino.stdTimeFunctions.isoTime,
    };

export const logger: Logger = pino({
  ...transportOptions,
  ...pinoParams,
});

const loggerDetails = () => {
  const stackTrace = new Error().stack?.split("\n") as string[];
  // Extract the filename and line number from the stack trace
  const caller = stackTrace[3].match(/at (.*?) \((.*?):(\d+):(\d+)\)/);
  const functionName = caller ? caller[1] : null;
  let filename = caller ? caller[2] : null;
  filename?.includes("webpack-internal:///")
    ? (filename = filename.replace("webpack-internal:///", ""))
    : (filename = filename);
  const lineNumber = caller ? caller[3] : null;
  return { functionName, filename, lineNumber };
};

export class CustomLogger {
  constructor() {}

  info(message: any) {
    const { functionName, filename, lineNumber } = loggerDetails();
    logger.info(
      `${message}` + ` \x1b[38;5;214mat [${functionName} - ${filename}]\x1b[0m `
    );
  }

  debug(message: any) {
    const { functionName, filename, lineNumber } = loggerDetails();
    logger.debug(
      `${message}` + ` \x1b[38;5;214mat [${functionName} - ${filename}]\x1b[0m `
    );
  }

  warn(message: any) {
    const { functionName, filename, lineNumber } = loggerDetails();
    logger.warn(
      `${message}` + ` \x1b[38;5;214mat [${functionName} - ${filename}]\x1b[0m `
    );
  }

  error(message: any, stack?: string) {
    const { functionName, filename, lineNumber } = loggerDetails();
    logger.error(
      `${message}` + ` \x1b[38;5;214mat [${functionName} - ${filename}]\x1b[0m `
    );
  }
}
