import http, {Server} from 'http';

import {initializeApp} from './app';
import {Config} from './config';
import logger from './logger';

export * from './app';
export * from './config';
export * from './context';
export * from './logger';

export const createServer = (config: Config) => {
    try {
        // Initialize app and server
        logger.info('Initializing server...');
        const app = initializeApp(config);
        const server = http.createServer(app.callback());
        logger.info('Finished initializing server.');

        return {
            server,
            app
        };
    } catch (err) {
        logger.error('Failed to initialize server:');
        logger.error(err);
        return null;
    }
};

export const startServer = async (config: Config, server: Server) => new Promise((resolve, reject) => {
    try {
        // Start server
        server.listen(config.port, () => {
            logger.info(`Started HTTP server on http://localhost:${config.port}`);

            return resolve();
        });
    } catch (err) {
        return reject(err);
    }
});
