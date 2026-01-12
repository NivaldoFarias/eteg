FROM oven/bun:latest AS base

WORKDIR /app

FROM base AS dependencies

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM dependencies AS development

COPY . .
EXPOSE 3000
RUN bun run db:generate
CMD ["sh", "-c", "bun run db:migrate && bun run dev"]

FROM dependencies AS builder

COPY . .
RUN bun run db:generate
RUN bun run build

FROM base AS production

COPY --from=builder --chown=1001:1001 /app/next.config.mjs ./
COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/.next/static ./.next/static
COPY --from=builder --chown=1001:1001 /app/public ./public
COPY --from=builder --chown=1001:1001 /app/prisma ./prisma
COPY --from=builder --chown=1001:1001 /app/generated ./generated
COPY --from=dependencies --chown=1001:1001 /app/node_modules ./node_modules
COPY --from=builder --chown=1001:1001 /app/package.json ./package.json

USER 1001
EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "run", "start"]