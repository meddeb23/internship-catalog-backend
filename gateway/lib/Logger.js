import winston, { format } from "winston"

const { combine, timestamp, metadata, printf } = format;

// Create transport for logging errors to separate files
const errorTransport = new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
});

// Create transport for logging all logs to a global file
const globalTransport = new winston.transports.File({
    filename: "logs/all.log",
});

const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, metadata }) => {
        let logMessage = `${timestamp} [${level}] ${message}`;
        if (metadata && Object.keys(metadata).length > 0) {
            logMessage += `, ${JSON.stringify(metadata)}`;
        }
        return logMessage;
    })
);

var config = winston.config;
const logger = winston.createLogger({
    format: combine(
        metadata(),
        timestamp(),
        printf(info => {
            return `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message} ${info.metadata && Object.keys(info.metadata).length ? "\n" + JSON.stringify(info.metadata) : ""}`
        })
    ),
    // formatter: logFormat,

    // function (options) {
    //     return options.timestamp() + ' ' +
    //         config.colorize(options.level, options.level.toUpperCase()) + ' ' +
    //         (options.message ? options.message : '') +
    //         (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
    // },
    transports: [errorTransport, globalTransport, new winston.transports.Console(),],
});

export default logger