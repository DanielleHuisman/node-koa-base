# koa-base

Koa server with basic middleware.

## Middleware

-   [Koa Helmet](https://github.com/venables/koa-helmet)
-   [Koa Response Time](https://github.com/koajs/response-time)
-   [Koa Conditional GET](https://github.com/koajs/conditional-get)
-   [Koa ETag](https://github.com/koajs/etag)
-   [Koa Compress](https://github.com/koajs/compress)
-   [Koa Session](https://github.com/koajs/session)
-   [Koa Body Parser](https://github.com/koajs/bodyparser)
-   [Koa JSON](https://github.com/koajs/json)
-   [Koa Static](https://github.com/koajs/static)
-   [Winston logger](https://github.com/winstonjs/winston)

## Installation

```bash
yarn add @danielhuisman/koa-base
```

## Usage

```typescript
import {createServer, logger, startServer} from '@danielhuisman/koa-base';
import Router from 'koa-router';
import path from 'path';

const config = {
    port: 5000,

    session: {
        secret: 'sessionSecret'
    },

    static: {
        serve: process.env.STATIC_SERVE !== 'false',
        path: path.join(__dirname, '..', 'static')
    }
};

(async () => {
    logger.info('Starting application...');

    // Initialize server
    const {server, app} = createServer(config);

    // Initialize router
    const router = new Router();

    // Index route
    router.get('/', async (ctx) => {
        return ctx.success(
            {
                message: 'Hello World!'
            },
            200
        );
    });

    // Add router
    app.use(router.routes());
    app.use(router.allowedMethods());

    // Handle unknown routes
    app.use(async (ctx, next) => {
        ctx.error(404, 'Not found');
        await next();
    });

    // Start server
    await startServer(config, server);

    logger.info('Started application.');
})();
```
