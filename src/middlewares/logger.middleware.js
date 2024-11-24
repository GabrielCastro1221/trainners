const winston = require("winston");
const path = require("path");
const configObject = require("../config/env.config");

const createLogger = (
  level = configObject.logger.log_level,
  logToFile = configObject.logger.log_to_file
) => {
  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];

  if (logToFile) {
    transports.push(
      new winston.transports.File({
        filename: path.join(__dirname, configObject.logger.log_file_name),
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
  }

  return winston.createLogger({
    level: level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: transports,
  });
};

const logger = createLogger(
  configObject.logger.log_level || "info",
  configObject.logger.log_to_file === "true"
);

module.exports = { logger };
