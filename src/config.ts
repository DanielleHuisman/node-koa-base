import helmet from 'helmet';
import session from 'koa-session';
import staticMiddleware from 'koa-static';

// NOTE: koa-helmet does not export this definition
type HelmetOptions = Required<Parameters<typeof helmet>>[0];

export interface Config {
    host?: string;
    port: number;

    session: Partial<session.opts> & {
        secret: string;
    };

    static?: staticMiddleware.Options & {
        serve: boolean;
        path?: string;
    };

    helmet?: HelmetOptions;
}
