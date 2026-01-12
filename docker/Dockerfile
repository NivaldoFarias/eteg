FROM oven/bun:latest AS base

WORKDIR /app

FROM base AS dependencies

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM dependencies AS development

USER bun
COPY . .
EXPOSE 3000
RUN bun run db:generate 
CMD ["sh", "-c", "bun run db:migrate && bun run dev"]

FROM dependencies AS builder

COPY . .
RUN bun run db:generate 
RUN bun run build

FROM base AS production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER bun
EXPOSE 3000
CMD ["sh", "-c", "bun run db:migrate:deploy && bun server.js"]