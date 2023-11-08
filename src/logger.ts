import chalk from 'chalk';
import type {Middleware} from 'koa';
import winston from 'winston';

// Create Winston instance
export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(
                    (info) =>
                        `[${info.timestamp}] [server] ${info.level}: ${
                            info instanceof Error ? info.stack : info.message
                        }`
                )
            )
        })
    ]
});

export default logger;

type Level = 'info' | 'warn' | 'error';

const STATUS_COLORS: Record<Level, string> = {
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
        if (err instanceof Error) {
            // Log the error message
            logger.error(err.stack || err.message);
        } else {
            logger.error(err);
        }
    }
    const end = new Date().getTime();
    const responseTime = end - start;

    // Determine log level
    let level: Level = 'info';
    if (ctx.status >= 500) {
        level = 'error';
    }
    if (ctx.status >= 400) {
        level = 'warn';
    }

    // Construct message
    const message = [
        chalk.gray(`${ctx.method} ${ctx.originalUrl}`),
        (chalk[STATUS_COLORS[level] as keyof typeof chalk] as (text: string) => string)(`${ctx.status}`),
        chalk.gray(`${responseTime}ms`)
    ].join(' ');

    // Log the message
    logger.log(level, message);
};
