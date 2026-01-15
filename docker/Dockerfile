ARG APP_DIR=/usr/src/app
FROM oven/bun:1.3-alpine AS base

WORKDIR $APP_DIR

FROM base AS deps

RUN apk add --no-cache libc6-compat curl
WORKDIR $APP_DIR
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM deps AS development

ENV NODE_ENV=development
WORKDIR $APP_DIR

COPY . .
EXPOSE 3000
RUN bun run db:generate
CMD ["sh", "-c", "bun run db:migrate && bun run dev:webpack"]

FROM deps AS builder

WORKDIR $APP_DIR
COPY . .
RUN bun run db:generate
RUN bun run build

FROM base AS production

ARG APP_DIR=/usr/src/app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
WORKDIR $APP_DIR

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs $APP_DIR/public ./public
COPY --from=builder --chown=nextjs:nodejs $APP_DIR/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs $APP_DIR/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs $APP_DIR/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs $APP_DIR/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs $APP_DIR/generated ./generated
COPY --from=builder --chown=nextjs:nodejs $APP_DIR/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["bun", "server.js"]