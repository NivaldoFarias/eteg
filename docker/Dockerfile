# Base image with Bun
FROM oven/bun:1.2-alpine AS base
WORKDIR /app

# Development stage
FROM base AS development
COPY package.json bun.lock* ./
RUN bun install
COPY . .
RUN mkdir -p .next
EXPOSE 3000
CMD ["bun", "dev"]

# Dependencies for production
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Build stage
FROM base AS builder
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run db:generate && bun run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000

CMD ["bun", "start"]