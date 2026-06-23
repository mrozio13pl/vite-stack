import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './global.css';

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultStaleTime: 5000,
    scrollRestoration: true,
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

const root = createRoot(document.querySelector('#root')!);
root.render(<App />);
