import winston from 'winston';
import chalk from 'chalk';
import {Middleware} from 'koa';

// Create Winston instance
export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf((info) => `[${info.timestamp}] [server] ${info.level}: ${info instanceof Error ? info.stack : info.message}`)
            )
        })
    ]
});

export default logger;

const STATUS_COLORS = {
    error: 'red',
    warn: 'yellow',
    info: 'green'
};

export const middleware: Middleware = async (ctx, next) => {
    // Calculate response time
    const start = new Date().getTime();
    try {
        await next();
    } catch (err) {
        // Log the error message
        logger.error(err.stack || err.message);
    }
    const end = new Date().getTime();
    const responseTime = end - start;

    // Determine log level
    let level = 'info';
    if (ctx.status >= 500) {
        level = 'error';
    }
    if (ctx.status >= 400) {
        level = 'warn';
    }

    // Construct message
    const message = [
        chalk.gray(`${ctx.method} ${ctx.originalUrl}`),
        chalk[STATUS_COLORS[level]](`${ctx.status}`),
        chalk.gray(`${responseTime}ms`)
    ].join(' ');

    // Log the message
    logger.log(level, message);
};
