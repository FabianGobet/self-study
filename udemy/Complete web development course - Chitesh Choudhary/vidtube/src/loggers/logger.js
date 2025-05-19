import { createLogger, format, transports } from "winston";
import winston from "winston";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Destructure format methods for cleaner code
const { combine, timestamp, json, colorize, printf, label } = format;

// ---------- Configuration ----------

// Get directory path for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDirPath = path.join(__dirname, "../logs");

// Ensure log directory exists
if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath, { recursive: true });
}

// Define log levels (most severe to least severe)
const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  http: 3,
  verbose: 4,
  trace: 5,
  info: 6,
  debug: 7
};

// Add colors for log levels
const logColors = {
  fatal: "red",
  error: "magenta",
  warn: "yellow",
  http: "green",
  verbose: "cyan",
  trace: "white",
  info: "blue",
  debug: "grey"
};

// Add colors to winston
winston.addColors(logColors);

// Determine default log level based on environment
const getDefaultLogLevel = () => (process.env.__DEV__ ? "debug" : "info");

// ---------- Formatters ----------

// Create standardized timestamp format used by both console and file logs
const timestampFormat = timestamp({
  format: "YYYY-MM-DD HH:mm:ss.SSS"
});

// Format for file logs (JSON with timestamp)
const fileLogFormat = combine(timestampFormat, json());

// Format for console logs (colored, human-readable)
const consoleLogFormat = combine(
  colorize({ all: true }),
  timestampFormat,
  printf(({ level, message, timestamp, loggerName = "app" }) => {
    // Convert objects to strings and trim whitespace
    const msg =
      typeof message === "object"
        ? JSON.stringify(message)
        : String(message).trim();

    return `[${level}]-[${timestamp}]-[${loggerName}]: ${msg}`;
  })
);

// Custom format to add logger name to log metadata
const addLoggerName = (name) =>
  format((info) => {
    info.loggerName = name;
    return info;
  })();

// ---------- Logger Factory ----------

/**
 * Creates a named logger with specified configurations.
 *
 * @param {string} name - The name of the logger, used for labeling logs.
 * @param {string} [level=getDefaultLogLevel()] - The logging level (e.g., 'INFO', 'ERROR').
 * @param {Object} [options={ console: true }] - Configuration options for the logger.
 * @param {boolean} [options.console=true] - Whether to enable console logging.
 * @returns {winston.Logger} - A configured Winston logger instance.
 */
const createNamedLogger = (
  name,
  level = getDefaultLogLevel(),
  options = { console: true }
) => {
  // Define transports based on options
  const loggerTransports = [];

  // Add console transport if enabled
  if (options.console) {
    loggerTransports.push(
      new transports.Console({
        format: combine(addLoggerName(name), consoleLogFormat),
        level: level,
        silent: name === "HTTP" // Silence HTTP logs in console
      })
    );
  }

  // Always add file transport
  loggerTransports.push(
    new transports.File({
      filename: path.join(logDirPath, `${name}.log`),
      format: fileLogFormat
    })
  );

  // Create and return the logger
  return createLogger({
    levels: logLevels,
    level,
    format: combine(label({ label: name }), timestampFormat, json()),
    transports: loggerTransports,
    exitOnError: false
  });
};

// ---------- Create Logger Instances ----------

// Application loggers
const appLogger = createNamedLogger("app");
const dbLogger = createNamedLogger("db");
const httpLogger = createNamedLogger("http", "HTTP", { console: false });

// ---------- Morgan HTTP Request Logger ----------

// Define JSON format for HTTP requests
const morganFormat = (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    content_length: tokens.res(req, res, "content-length"),
    response_time_ms: tokens["response-time"](req, res),
    remote_addr: tokens["remote-addr"](req, res),
    user_agent: tokens["user-agent"](req, res)
  });
};

// Create stream that writes to our Winston HTTP logger
const stream = {
  write: (message) => {
    try {
      const logObject = JSON.parse(message);
      httpLogger.http(logObject);
    } catch (e) {
      httpLogger.http(message.trim());
    }
  }
};

// Create Morgan middleware
const morganMiddleware = morgan(morganFormat, { stream });

// ---------- Exports ----------

export { appLogger, dbLogger, httpLogger, morganMiddleware };
