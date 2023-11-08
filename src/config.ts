import type helmet from 'helmet';
import type session from 'koa-session';
import type staticMiddleware from 'koa-static';

// NOTE: koa-helmet does not export this definition
export type HelmetOptions = Required<Parameters<typeof helmet>>[0];

export interface Config {
    host?: string;
    port: number;

    session: Partial<session.opts> & {
        secret: string;
    };

    static?: staticMiddleware.Options & {
        serve: boolean;
        path: string;
    };

    helmet?: HelmetOptions;
}
