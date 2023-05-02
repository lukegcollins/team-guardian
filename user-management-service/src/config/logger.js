// Import required modules and files
const dotenv = require("dotenv").config();
const winston = require('winston');

// Get the base name of the current file
const fn = require('path').basename(__filename);

// Destructure required components from winston module
const { createLogger, format, transports } = winston;
const { combine, colorize, json, metadata, printf, prettyPrint, timestamp } = format;

// Create logger instance
const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        printf(info => `${info.timestamp} ${info.level} ${info.message}`),
    ),
    transports: [
        new transports.File({
            filename: 'error.log',
            dirname: `${process.env.UMS_LOG_DIR}`,
            level: 'error',
            format: combine(json())
        }),
        new transports.File({
            filename: 'info.log',
            dirname: `${process.env.UMS_LOG_DIR}`,
            level: 'info',
            format: combine(json())
        }),
        new transports.File({
            filename: 'debug.log',
            dirname: `${process.env.UMS_LOG_DIR}`,
            level: 'debug',
            format: combine(json(), prettyPrint())
        })
    ],
    exitOnError: false
});


const consoleFormat = printf(info => `${info.timestamp} ${info.level} ${info.message}`)
// Add console transport if not in production environment
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        level: 'debug',
        format: combine(colorize(), consoleFormat)
    }));
}

// Export logger instance
module.exports = logger;

// Logger Samples
// Debug message with metadata
// logger.debug('This is a debug message', { key1: 'value1', key2: 'value2' });

// Debug message without metadata
// logger.debug('This is another debug message');

// Info message with metadata
// logger.info('This is an info message', { key1: 'value1', key2: 'value2' });

// Info message without metadata
// logger.info('This is another info message');

// Error message with metadata
// logger.error('This is an error message', { key1: 'value1', key2: 'value2' });

// Error message without metadata
// logger.error('This is another error message');