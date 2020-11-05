import session from 'koa-session';
import staticMiddleware from 'koa-static';

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
}
