/** @jsxImportSource hono/jsx */

import { createRouter } from './base';
import { testRouter } from './routes/test';
import { todosRouter } from './routes/todos';
import { serveStatic } from '@hono/node-server/serve-static';

const app = createRouter();

const api = createRouter().route('/test', testRouter).route('/todos', todosRouter);

api.use('*', async (c) => c.notFound());

app.route('/api', api);

if (import.meta.env.PROD) {
    app.get('/*', serveStatic({ root: './dist' }));
}

app.get('/*', (c) => {
    return c.html(
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                <link rel="icon" type="image/svg+xml" href="./logo.svg" />
                <title>vitestack</title>

                {import.meta.env.PROD ? (
                    <>
                        <script type="module" src="/static/client.js" />
                        <link
                            rel="stylesheet"
                            href="/static/assets/style.css"
                            precedence="default"
                        />
                    </>
                ) : (
                    <>
                        <script type="module" src="/server/refresh.ts" />
                        <script type="module" src="/client/main.tsx" />
                    </>
                )}
            </head>
            <body>
                <div id="root" />
            </body>
        </html>,
    );
});

export type Api = typeof api;

export default app;
