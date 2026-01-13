# Project Roadmap

Scrum board for the ETEG customer registration form assessment.

## Phase 1: Database Schema

- [x] Define `Customer` model in `prisma/schema.prisma`
  - Fields: `id`, `fullName`, `cpf`, `email`, `favoriteColor`, `observations`, `createdAt`
  - Unique constraints on `cpf` and `email`
- [x] Create initial migration
- [x] Verify schema with `bun run db:generate`
- [x] Document database schema in README

## Phase 2: API Layer

- [x] Create validation schemas in `app/lib/validations/customer.ts`
  - Zod schema for customer input
  - CPF format validation (use `gerador-validador-cpf` package)
  - Email format validation
  - Color enum (rainbow colors)
- [x] Create `POST /api/customers` route handler
  - Request body validation
  - Duplicate check (CPF/email)
  - Database insert
  - Proper error responses (400, 409, 500)
- [x] Test API with manual requests
- [x] Add unit tests for validation schemas
- [x] Add API route tests (success, validation errors, duplicates)
- [x] Document API endpoints in README

## Phase 3: UI Components

- [x] Set up ShadCN UI base components
  - Button, Input, Label, Select, Textarea, Skeleton, Spinner
  - Form components (Form, FormField, FormItem, FormMessage)
- [x] Build `CustomerForm` component
  - react-hook-form integration
  - Zod resolver for client validation
  - All required fields with proper labels
  - Submit handler with API call
- [x] Add loading and error states
- [x] Add success feedback (toast or redirect)
- [x] Create API fetch service (`app/lib/api/`)
  - Type-safe fetch wrapper with generics
  - Centralized error handling
  - Request/response typing
- [x] Add client component tests for `CustomerForm`
  - Form rendering
  - Field validation behavior
  - Submit handler interaction
- [x] Extra: Add input mask for CPF field

## Phase 4: Page Integration

- [x] Create main page with form
- [x] Style with Tailwind (responsive, centered layout)
- [x] Test full flow: form → API → database
- [x] Add integration tests for page components
- [x] Update README with usage instructions

## Phase 5: Docker & Polish

- [x] Verify `docker-compose.yml` works for full stack
- [x] Test `docker compose up` from clean state
- [x] Add basic error boundary
- [x] Final cleanup and README update
- [x] Ensure all tests pass in CI environment
- [x] Update README with Docker instructions

## Phase 6: Production Deployment

- [x] Create production Docker Compose override file
- [x] Set up GitHub Actions CI/CD workflow
- [x] Configure deployment
- [x] Set up PostgreSQL
- [x] Configure environment variables for production
- [x] Create `TECHNICAL_DECISIONS.md` documenting stack choices
- [x] Test full deployment pipeline
- [x] Verify production health checks

---

## Acceptance Criteria

- [x] Form submits successfully and persists to PostgreSQL
- [x] Duplicate CPF/email shows user-friendly error
- [x] Validation errors display inline
- [x] Success state is clearly communicated
- [x] `docker compose up` starts working application
- [x] Code is clean and maintainable
- [x] All tests pass (`bun run test`)
- [x] README documents setup, API, and usage
- [ ] Production deployment working with free-tier services
- [ ] CI/CD pipeline automated via GitHub Actions
