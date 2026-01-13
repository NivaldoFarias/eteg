FROM oven/bun:1.3-alpine AS base

WORKDIR /app

FROM base AS deps

RUN apk add --no-cache libc6-compat curl
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM deps AS development

ENV NODE_ENV=development

COPY . .
EXPOSE 3000
RUN bun run db:generate
CMD ["sh", "-c", "bun run db:migrate && bun run dev:webpack"]

FROM deps AS builder

COPY . .
RUN bun run db:generate
RUN bun run build

FROM base AS production

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["bun", "server.js"]