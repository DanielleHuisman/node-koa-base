import session from 'koa-session';
import staticMiddleware from 'koa-static';

export interface Config {
    port: number;

    session: Partial<session.opts> & {
        secret: string;
    };

    static?: staticMiddleware.Options & {
        serve: boolean;
        path?: string;
    };
}
