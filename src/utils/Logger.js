const winston = require("winston");
const path = require("path");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console({ level: "info"}),
    new winston.transports.File({ filename: path.join(__dirname, "../../logs/error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(__dirname, "../../logs/combined.log") })
  ]
});

module.exports = logger;
