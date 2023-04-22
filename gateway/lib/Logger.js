import winston, { format } from "winston"

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const customFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(
        (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message} ${info.metadata && Object.keys(info.metadata).length ? "\n" + JSON.stringify(info.metadata) : ""}`,
    ),
)


const transports = [
    new winston.transports.File({ filename: "logs/all.log", }),
    new winston.transports.File({ filename: "logs/error.log", level: "error", }),
    new winston.transports.Console()
]

const logger = winston.createLogger({
    // format: combine(
    //     metadata(),
    //     timestamp(),
    //     printf(info => {
    //         return `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message} ${info.metadata && Object.keys(info.metadata).length ? "\n" + JSON.stringify(info.metadata) : ""}`
    //     })
    // ),
    // formatter: logFormat,

    // function (options) {
    //     return options.timestamp() + ' ' +
    //         config.colorize(options.level, options.level.toUpperCase()) + ' ' +
    //         (options.message ? options.message : '') +
    //         (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
    // },
    levels,
    format: customFormat,
    transports,
});

export default logger