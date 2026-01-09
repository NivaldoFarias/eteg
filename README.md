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
| `bun run type-check`  | Run TypeScript type check  |
| `bun run test`        | Run unit tests             |
| `bun run test:watch`  | Run tests in watch mode    |
| `bun run db:migrate`  | Run database migrations    |
| `bun run db:studio`   | Open Prisma Studio         |
| `bun run docker:up`   | Start PostgreSQL container |
| `bun run docker:down` | Stop PostgreSQL container  |

## Database Schema

### Customer Table

| Field           | Type                 | Description                        |
| --------------- | -------------------- | ---------------------------------- |
| `id`            | `String` (CUID)      | Primary key                        |
| `fullName`      | `String`             | Customer's full name (2-255 chars) |
| `cpf`           | `String` (unique)    | Brazilian tax ID (11 digits)       |
| `email`         | `String` (unique)    | Email address                      |
| `favoriteColor` | `FavoriteColor` enum | One of the rainbow colors          |
| `observations`  | `String?`            | Optional notes (max 1000 chars)    |
| `createdAt`     | `DateTime`           | Registration timestamp             |

### FavoriteColor Enum

`RED` | `ORANGE` | `YELLOW` | `GREEN` | `BLUE` | `INDIGO` | `VIOLET`

## API Reference

### POST /api/customers

Creates a new customer registration.

#### Request Body

```json
{
	"fullName": "John Doe",
	"cpf": "529.982.247-25",
	"email": "john@example.com",
	"favoriteColor": "BLUE",
	"observations": "Optional notes"
}
```

| Field           | Type     | Required | Description                                              |
| --------------- | -------- | -------- | -------------------------------------------------------- |
| `fullName`      | `string` | Yes      | 2-255 characters                                         |
| `cpf`           | `string` | Yes      | Valid Brazilian CPF (with or without mask)               |
| `email`         | `string` | Yes      | Valid email address                                      |
| `favoriteColor` | `string` | Yes      | One of: RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET |
| `observations`  | `string` | No       | Max 1000 characters                                      |

#### Responses

**201 Created** - Customer successfully registered

```json
{
	"success": true,
	"data": {
		"id": "clx1234567890",
		"fullName": "John Doe",
		"email": "john@example.com",
		"favoriteColor": "BLUE",
		"createdAt": "2026-01-09T00:00:00.000Z"
	}
}
```

**400 Bad Request** - Validation error

```json
{
	"success": false,
	"error": "VALIDATION_ERROR",
	"message": "CPF is invalid"
}
```

**409 Conflict** - Duplicate CPF or email

```json
{
	"success": false,
	"error": "DUPLICATE_ENTRY",
	"message": "A customer with this CPF already exists"
}
```

**500 Internal Server Error** - Server error

```json
{
	"success": false,
	"error": "INTERNAL_ERROR",
	"message": "An unexpected error occurred. Please try again later."
}
```

## Docker Production

Build and run with Docker:

```bash
docker build -f docker/Dockerfile -t eteg --target production .
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" eteg
```
