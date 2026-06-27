# vite-stack

A full-stack template combining best of technologies from JS ecosystem.

<!-- toc:start -->
[Motivation](#motivation)

[Introduction](#introduction)
- [The base stack](#the-base-stack)
  - [App shell](#app-shell)
  - [Routing](#routing)
  - [API](#api)
  - [Styling](#styling)
  - [Code quality](#code-quality)

[Expanding the stack](#expanding-the-stack)

[Recipes](#recipes)
- [Drizzle](#drizzle)
- [Shadcn/ui](#shadcnui)
<!-- toc:end -->

## Motivation

Over the years I've worked on various projects involving web-dev varying in magnitude and scale, trying numerous ways to have a pleasant DX. I found many solutions to not satisfy me with lack of control, no low-level integration, vagueness, bad performance and much more. This is my best attempt at making a template which integrates all of my favorite libraries and combines the frontend with the backend.

## Introduction

Vite-stack is a fully-featured stack built on Vite. It can be easily extended with agens using prompts given for each feature.

While the codebase is pretty self-explanatory, I highly recommend reading through the readme as it shows the good standards and outlines long-term support.

### The base stack

The base is what every feature builds on top of. It is intentionally small, but gives you the exact pieces needed for a full-stack app.

#### App shell

Vite runs the project and handles both development and production builds. In development it gives fast refresh and a quick feedback loop. In production it builds the client and server output.

React is used for the frontend. The app starts in `client/main.tsx`, mounts into the root element, and renders the router.

- [Vite docs ⟶](https://vite.dev/guide)
- [React docs ⟶](https://react.dev/learn)

#### Routing

TanStack Router handles frontend routes. Routes live in `client/routes`.

This keeps pages file-based and easy to work with. Adding a new page should mostly mean adding a new route file.

- [TanStack Router docs ⟶](https://tanstack.com/router)

#### API

Hono handles the backend. The API starts in `server/index.tsx`, and feature routes can be added under `server/routes`.

The frontend uses `lib/api.ts` to call the backend. This keeps API calls typed from the server route all the way to the client, so changing an endpoint should show type errors where the client needs updating.

TanStack Query is included for fetching, caching, loading states, and refetching.

- [Hono docs ⟶](https://hono.dev)
- [TanStack Query docs ⟶](https://tanstack.com/query)

#### Styling

Tailwind is available globally through `client/global.css`. The base does not add much styling on purpose, so projects can choose their own look without fighting defaults.

The default font is Sora, loaded through `@fontsource-variable/sora` and wired into Tailwind as the sans font.

- [TailwindCSS docs ⟶](https://tailwindcss.com/docs)
- [Fontsource ⟶](https://fontsource.org/)

> 💡 You might also want to use shadcn ui.

#### Code quality

The base includes formatting and linting out of the box with an opinionated config. `oxfmt` handles formatting, and `oxlint` catches common issues before they turn into noise.

Pre-commit hooks run through `simple-git-hooks` and `nano-staged`, so changed files get formatted and linted before they are committed. This keeps the codebase consistent without needing to think about it every time.

- [Oxc formatter docs ⟶](https://oxc.rs/docs/guide/usage/formatter.html)
- [Oxlint docs ⟶](https://oxc.rs/docs/guide/usage/linter.html)

> 💡 Oxc tools are used instead of Prettier, ESLint, or Biome because they are simple to set up and very fast.

## Expanding the stack

The base is meant to be extended through the sections below. Each feature should explain what it adds, why it is useful, and how it fits into the existing app.

If you are using an agent, use the prompt in that section as a starting point. If you are not using an agent, follow the docs and examples directly.

<!-- recipes:start -->

## Recipes

These recipes can be applied with an agent, or copied from the applied branches.

### Drizzle
Drizzle is a lightweight TypeScript ORM that keeps database schema and queries close to regular code.

Use it when your app needs database persistence without adding a full backend framework.

> 💡 The branch uses PostgreSQL as the starter setup, but Drizzle supports [more](https://orm.drizzle.team/docs/get-started-postgresql). Adjust the prompt's dialect and driver if you want a different database.

<details>
<summary>Agent prompt</summary>

```text
Add minimal Drizzle ORM + PostgreSQL support to this vite-stack project.

Implement exactly:
- deps: drizzle-orm, pg
- dev deps: drizzle-kit, @types/pg
- drizzle.config.ts reading DATABASE_URL
- lib/db/schema.ts with todos: id, text, createdAt
- lib/db/index.ts exporting a typed db client
- scripts: db:generate, db:migrate, db:studio
- GET /api/todos returning the latest 20 todos and route mounted

Give next-step notes for generate/migrate.
```

</details>

Not using an agent?

- [Applied branch](../../tree/recipe/drizzle)
- [Diff](../../compare/main...recipe/drizzle)

### Shadcn/ui
Shadcn is one of the most popular ui libraries that gives fullcontrol and extensibility over your components.

To create a fully customizable theme visit [shadcn/create ⟶](https://ui.shadcn.com/create).

> 💡 The branch was set up using `pnpm dlx shadcn@latest init --preset b27Gdgau --base base --pointer`, and the font changed from `Inter` back to `Sora`.

Not using an agent?

- [Applied branch](../../tree/recipe/shadcn-ui)
- [Diff](../../compare/main...recipe/shadcn-ui)

<!-- recipes:end -->
