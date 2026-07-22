import 'virtual:uno.css';
import './style.css';
import { clsx } from 'clsx';
import { ThemeProvider, useTheme } from 'next-themes';
import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { highlight } from 'sugar-high';
import { GithubIcon } from './icons/github.jsx';
import { CopyIcon } from './icons/copy.jsx';
import { ThemeIcon } from './icons/theme.jsx';

const README_URL = 'https://raw.githubusercontent.com/mrozio13pl/vite-stack/main/README.md';
const README_PAGE_URL = 'https://github.com/mrozio13pl/vite-stack/blob/main/README.md';

marked.use(gfmHeadingId());

function CopyButton({ code }) {
    const [state, setState] = useState('');
    const resetTimer = useRef();

    useEffect(() => () => clearTimeout(resetTimer.current), []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(code);
            setState('copied');
        } catch {
            setState('failed');
        }

        clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setState(''), 1500);
    }

    return (
        <button
            type="button"
            class="copy-code"
            data-state={state || undefined}
            aria-label={
                state === 'copied'
                    ? 'Code copied'
                    : state === 'failed'
                      ? 'Copy failed'
                      : 'Copy code'
            }
            aria-live="polite"
            onClick={copy}
        >
            <CopyIcon class="copy-icon" aria-hidden="true" />
            <span class="copy-status">Copied</span>
        </button>
    );
}

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <button
            type="button"
            class="ml-2 mt-3 flex cursor-pointer items-center gap-x-2 border-0 bg-(--color-transparent) p-0 font-mono text-sm text-(--color-foreground) hover:(font-bold underline) underline-offset-2 capitalize"
            aria-label="Toggle color theme"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
            <ThemeIcon className="size-6" aria-hidden="true" />
            {resolvedTheme}
        </button>
    );
}

function TableOfContents({ headings, active }) {
    return (
        <nav aria-label="On this page">
            <ul class="m-0 list-none p-0">
                {headings.map((heading) => (
                    <li key={heading.id} class="m-0 p-0">
                        <a
                            href={`#${heading.id}`}
                            aria-current={active === heading.id ? 'location' : undefined}
                            class={clsx(
                                'rounded-xl block px-3 py-1.5 text-sm no-underline transition-colors duration-150',
                                heading.depth > 2 && 'pl-6',
                                active === heading.id
                                    ? '-ml-px bg-[var(--color-active)] font-bold'
                                    : '-ml-px border-[var(--color-transparent)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                                !heading.text && 'capitalize',
                            )}
                        >
                            {heading.text || heading.id}
                        </a>
                    </li>
                ))}

                <a href="https://github.com/mrozio13pl/vite-stack">
                    <li className="ml-2 mt-4 hover:(underline font-bold) underline-offset-2 font-mono flex items-center gap-x-2 text-sm cursor-pointer">
                        <GithubIcon className="size-6 fill-[var(--color-foreground)]" />
                        mrozio13pl/vite-stack
                    </li>
                </a>
                <li>
                    <ThemeToggle />
                </li>
            </ul>
        </nav>
    );
}

async function loadPage() {
    const response = await fetch(README_URL);
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const document = new DOMParser().parseFromString(
        marked.parse(await response.text()),
        'text/html',
    );
    const headings = [...document.querySelectorAll('h2, h3, h4')]
        .filter((heading) => !heading.closest('details'))
        .map(({ id, textContent, tagName }) => ({
            id,
            text: textContent,
            depth: Number(tagName[1]),
        }));

    for (const anchor of document.querySelectorAll('a[href]')) {
        const href = anchor.getAttribute('href');
        if (!href.startsWith('#') && !URL.canParse(href)) {
            anchor.setAttribute('href', new URL(href, README_PAGE_URL).href);
        }
    }

    for (const picture of document.querySelectorAll('picture')) {
        const image = picture.querySelector('img');
        const darkSource = picture.querySelector('source[media="(prefers-color-scheme: dark)"]');
        const lightSource = picture.querySelector('source[media="(prefers-color-scheme: light)"]');
        if (!image || !darkSource || !lightSource) continue;

        image.dataset.darkSrc = darkSource.srcset;
        image.dataset.lightSrc = lightSource.srcset;
        darkSource.remove();
        lightSource.remove();
    }

    for (const code of document.querySelectorAll('code')) {
        code.classList.add('font-mono');
        if (code.parentElement?.tagName === 'PRE') {
            code.innerHTML = highlight(code.textContent);

            const pre = code.parentElement;
            const wrapper = document.createElement('div');
            const copyButtonRoot = document.createElement('span');
            wrapper.className = 'code-block';
            copyButtonRoot.className = 'copy-button-root';
            pre.replaceWith(wrapper);
            wrapper.append(pre, copyButtonRoot);
        }
    }

    return { html: document.body.innerHTML, headings };
}

function App({ page }) {
    const { resolvedTheme } = useTheme();
    const [active, setActive] = useState(page.headings[0]?.id ?? '');

    useEffect(() => {
        if (!page.html) return;

        const roots = [...document.querySelectorAll('.copy-button-root')];
        for (const root of roots) {
            const code = root.parentElement.querySelector('code').textContent;
            render(<CopyButton code={code} />, root);
        }

        return () => roots.forEach((root) => render(null, root));
    }, [page.html]);

    useEffect(() => {
        if (!page.html || !resolvedTheme) return;

        for (const image of document.querySelectorAll('.docs-prose img[data-dark-src]')) {
            image.src = image.dataset[`${resolvedTheme}Src`];
        }
    }, [page.html, resolvedTheme]);

    useEffect(() => {
        if (!page.headings.length) return;

        const elements = page.headings.map(({ id }) => document.getElementById(id));
        let frame;
        const update = () => {
            let current = elements[0]?.id;
            for (const element of elements) {
                if (element?.getBoundingClientRect().top > 120) break;
                current = element.id;
            }
            setActive(current);
            frame = undefined;
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });

        const target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [page.headings]);

    return (
        <div class="mx-auto flex max-w-5xl items-start gap-12 border-l border-l-[var(--color-border-subtle)] border-l-dashed px-4 [&>main]:py-8 lg:px-8">
            <aside class="sticky top-8 hidden max-h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto lg:block">
                <TableOfContents headings={page.headings} active={active} />
            </aside>

            <main class="min-w-0 flex-1 border-x border-x-[var(--color-border-subtle)] border-x-dashed">
                <details class="mb-8 border-y border-[var(--color-border-subtle)] border-dashed p-4 lg:hidden">
                    <summary class="cursor-pointer text-sm text-[var(--color-muted)]">
                        On this page
                    </summary>
                    <div class="mt-4">
                        <TableOfContents headings={page.headings} active={active} />
                    </div>
                </details>
                <article
                    class="docs-prose box-border max-w-[860px] px-8"
                    dangerouslySetInnerHTML={{ __html: page.html }}
                />
            </main>
        </div>
    );
}

try {
    const page = await loadPage();
    render(
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <App page={page} />
        </ThemeProvider>,
        document.querySelector('#app'),
    );
} catch (error) {
    render(
        <main class="mx-auto max-w-3xl px-4 py-16">
            <h1>Documentation unavailable</h1>
            <p>{error.message}</p>
        </main>,
        document.querySelector('#app'),
    );
}
