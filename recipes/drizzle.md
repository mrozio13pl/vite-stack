---
feature: Drizzle
branch: recipe/drizzle
base: main
status: active
---

# Drizzle

Drizzle is a lightweight TypeScript ORM that keeps database schema and queries close to regular code.

Use it when your app needs database persistence without adding a full backend framework.

> 💡 The branch uses PostgreSQL as the starter setup, but Drizzle supports [more](https://orm.drizzle.team/docs/get-started-postgresql). Adjust the prompt's dialect and driver if you want a different database.

## Agent prompt

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

## Applied version

- [Branch](../../tree/recipe/drizzle)
- [Diff](../../compare/main...recipe/drizzle)
