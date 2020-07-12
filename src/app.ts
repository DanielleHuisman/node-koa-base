import Koa from 'koa';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import responseTime from 'koa-response-time';
import conditionalGet from 'koa-conditional-get';
import etag from 'koa-etag';
import compress from 'koa-compress';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import jsonMiddleware from 'koa-json';
import staticMiddleware from 'koa-static';

import {Config} from './config';
import {Context} from './context';
import {middleware as logMiddleware} from './logger';

export const initializeApp = <IState = Koa.DefaultState, IContext extends Context = Context>(config: Config) => {
    // Initialize Koa application
    const app = new Koa<IState, IContext>();

    // Add middleware
    app.use(logMiddleware);
    app.use(helmet());
    app.use(responseTime());
    app.use(conditionalGet());
    app.use(etag());
    app.use(compress());
    app.keys = [config.session.secret];
    app.use(session({
        key: 'session',
        signed: true,
        ...config.session
    }, app));
    app.use(jsonMiddleware({
        pretty: false,
        param: 'pretty',
        spaces: 4
    }));
    app.use(bodyParser());

    // Register utility function middleware
    app.use(async (ctx, next) => {
        ctx.success = (data: any, status: number = 200) => {
            ctx.status = status;
            ctx.body = data;
            return ctx.response;
        };

        ctx.error = (status: number, message: string, data?: {[k: string]: any}) => {
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
