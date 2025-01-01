import winston from 'winston';

const { combine, timestamp, printf, errors } = winston.format;

// Custom log format
const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level}] : ${message} ${stack || ''}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',  // Minimum log level, 'info' for production
  format: combine(
    timestamp(),  // Include timestamp for each log
    errors({ stack: true }),  // Include stack trace for errors
    logFormat  // Custom format
  ),
  transports: [
    // Console transport for logging to the terminal
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),  // Colorize logs in the console for easy reading
        logFormat
      )
    }),
    // File transport for logging to a file
    new winston.transports.File({ filename: 'app.log' })  // Logs to 'app.log' file
  ]
});

// Export the logger
export default logger;