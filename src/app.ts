import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import conditionalGet from 'koa-conditional-get';
import etag from 'koa-etag';
import helmet from 'koa-helmet';
import jsonMiddleware from 'koa-json';
import mount from 'koa-mount';
import responseTime from 'koa-response-time';
import session from 'koa-session';
import staticMiddleware from 'koa-static';

import type {Config} from './config.js';
import type {Context} from './context.js';
import {middleware as logMiddleware} from './logger.js';

export const initializeApp = <IState = Koa.DefaultState, IContext extends Context = Context>(config: Config) => {
    // Initialize Koa application
    const app = new Koa<IState, IContext>();

    // Add middleware
    app.use(logMiddleware);
    // @ts-expect-error: Helmet options don't match
    app.use(helmet(config.helmet));
    app.use(responseTime());
    app.use(conditionalGet());
    app.use(etag());
    app.use(compress());
    app.keys = [config.session.secret];
    app.use(
        session(
            {
                key: 'session',
                signed: true,
                ...config.session
            },
            app as unknown as Koa
        )
    );
    app.use(
        jsonMiddleware({
            pretty: false,
            param: 'pretty',
            spaces: 4
        })
    );
    app.use(bodyParser());

    // Register utility function middleware
    app.use(async (ctx, next) => {
        ctx.success = (data: unknown, status: number = 200) => {
            ctx.status = status;
            ctx.body = data;
            return ctx.response;
        };

        ctx.error = (status: number, message: string, data?: Record<string, unknown>) => {
            ctx.status = status;
            ctx.body = {
                isError: true,
                code: status,
                message,
                ...data
            };
            return ctx.response;
        };

        await next();
    });

    // Add static file middleware
    if (config.static && config.static.serve) {
        app.use(mount('/static', staticMiddleware(config.static.path, config.static)));
    }

    return app;
};
