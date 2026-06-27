# syntax=docker/dockerfile:1.7

FROM node:24-bookworm-slim AS base

WORKDIR /app

ENV CI=true \
    PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH

RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY . .

RUN echo "[docker] building client + server bundles" && pnpm build

FROM base AS runner

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    PNPM_CONFIG_LOGLEVEL=info

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Keep the installed dependency tree from the build stage. Runtime still needs
# drizzle-kit if you run migrations from the container.
COPY --from=build /app /app

EXPOSE 3000

CMD ["dumb-init", "pnpm", "start"]
