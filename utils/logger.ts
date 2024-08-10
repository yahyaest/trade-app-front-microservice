import pino, { Logger } from "pino";

export const logger: Logger = pino({
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
      },
    ],
  },
  level: "debug",
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
