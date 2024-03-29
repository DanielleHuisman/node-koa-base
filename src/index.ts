import http, {type Server} from 'http';
import type {DefaultState} from 'koa';

import {initializeApp} from './app.js';
import type {Config} from './config.js';
import type {Context} from './context.js';
import logger from './logger.js';

export * from './app.js';
export * from './config.js';
export * from './context.js';
export * from './logger.js';

export const createServer = <IState = DefaultState, IContext extends Context = Context>(config: Config) => {
    try {
        // Initialize app and server
        logger.info('Initializing server...');
        const app = initializeApp<IState, IContext>(config);
        const server = http.createServer(app.callback());
        logger.info('Finished initializing server.');

        return {
            server,
            app
        };
    } catch (err) {
        logger.error('Failed to initialize server:');
        logger.error(err);
        throw new Error('Failed to initialize server.');
    }
};

export const startServer = async (config: Config, server: Server) =>
    new Promise<void>((resolve, reject) => {
        try {
            const host = config.host;
            const port = config.port;

            // Start server
            if (host === undefined) {
                server.listen(port, () => {
                    logger.info(`Started HTTP server on http://localhost:${port}`);

                    return resolve();
                });
            } else {
                server.listen(port, host, () => {
                    logger.info(`Started HTTP server on http://${host}:${port}`);

                    return resolve();
                });
            }
        } catch (err) {
            return reject(err);
        }
    });
