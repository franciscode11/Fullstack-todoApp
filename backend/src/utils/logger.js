import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, printf, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a Winston logger
const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [
    new transports.Console({
      format: isProduction ? json() : combine(colorize(), consoleLogFormat),
    }),
    new transports.File({ filename: "app.log" }),
    new transports.File({ filename: "errors.log", level: "error" }),
  ],
});

export default logger;
