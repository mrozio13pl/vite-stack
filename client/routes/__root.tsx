import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => (
        <h1 className="h-dvh w-screen flex justify-center items-center text-4xl font-bold">
            Page not found.
        </h1>
    ),
});

function RootComponent() {
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
