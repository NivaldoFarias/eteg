# Eteg - Customer Registration System

A simple customer registration form built with Next.js 15, React 19, Tailwind CSS v4, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, ShadCN UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL 16
- **Runtime**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest)
- [Docker](https://www.docker.com/) (for PostgreSQL)

### Development

1. Install dependencies:

```bash
bun install
```

2. Start PostgreSQL via Docker:

```bash
bun run docker:up
```

3. Run database migrations:

```bash
bun run db:migrate
```

4. Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

| Command               | Description                |
| --------------------- | -------------------------- |
| `bun run dev`         | Start development server   |
| `bun run build`       | Build for production       |
| `bun run start`       | Start production server    |
| `bun run lint`        | Run ESLint                 |
| `bun run typecheck`   | Run TypeScript type check  |
| `bun run db:migrate`  | Run database migrations    |
| `bun run db:studio`   | Open Prisma Studio         |
| `bun run docker:up`   | Start PostgreSQL container |
| `bun run docker:down` | Stop PostgreSQL container  |

## Docker Production

Build and run with Docker:

```bash
docker build -f docker/Dockerfile -t eteg --target production .
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" eteg
```
