import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import devServer from '@hono/vite-dev-server';
import adapter from '@hono/vite-dev-server/node';
import build from '@hono/vite-build/node';
import tailwindcss from '@tailwindcss/vite';

const sharedPlugins = [
    react(),
    tanstackRouter({
        target: 'react',
        routesDirectory: './client/routes',
        generatedRouteTree: './client/routeTree.gen.ts',
        codeSplittingOptions: {
            splitBehavior: ({ routeId }) => {
                if (routeId.startsWith('/client')) {
                    return [
                        ['component'],
                        ['pendingComponent'],
                        ['errorComponent'],
                        ['notFoundComponent'],
                    ];
                }
            },
        },
    }),
    tailwindcss(),
];

// const requireApiTarget = () => {
//     const target = process.env.API_TARGET;

//     if (!target) {
//         throw new Error('API_TARGET required for dev server');
//     }

//     return target;
// };

export default defineConfig(({ command, mode }) => {
    if (mode === 'client') {
        return {
            build: {
                rolldownOptions: {
                    input: ['./client/main.tsx'],
                    output: {
                        entryFileNames: 'static/client.js',
                        chunkFileNames: 'static/assets/[name]-[hash].js',
                        assetFileNames: 'static/assets/[name].[ext]',
                    },
                },
                copyPublicDir: false,
                cssCodeSplit: false,
            },
            resolve: {
                tsconfigPaths: true,
            },
            plugins: sharedPlugins,
        };
    }

    return {
        base: '/',
        resolve: {
            tsconfigPaths: true,
        },
        plugins: [
            devServer({
                entry: 'server/index.tsx',
                adapter,
            }),
            build({
                entry: 'server/index.tsx',
            }),
            ...sharedPlugins,
        ],
    };
});
