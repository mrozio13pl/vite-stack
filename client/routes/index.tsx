import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Home,
});

function Home() {
    const { data, isLoading } = useQuery({
        queryKey: ['message'],
        queryFn: async () => {
            const res = await api.test.$get();
            return res.json();
        },
    });

    return (
        <main className="size-full bg-zinc-950 px-6 py-16 text-zinc-50">
            <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <img src="/logo.svg" alt="vite-stack logo" className="mb-8 size-20" />

                <p className="mb-3 px-3 py-1 text-sm text-zinc-400">Full-stack Vite template</p>

                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">vite-stack</h1>

                <p className="mt-5 max-w-xl text-lg text-zinc-400">
                    React, TanStack Router, Hono, Tailwind, and typed API calls in one boring
                    starter.
                </p>

                <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-left w-sm">
                    <p className="text-sm font-medium text-zinc-300">
                        Fetching {api.test.$path()}:
                    </p>
                    <code className="mt-3 block text-sm text-emerald-400">
                        Message: {isLoading ? 'Loading...' : (data?.message ?? 'No response')}
                    </code>
                </div>
            </section>
        </main>
    );
}
