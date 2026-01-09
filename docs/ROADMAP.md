# Project Roadmap

Scrum board for the ETEG customer registration form assessment.

## Phase 1: Database Schema

- [ ] Define `Customer` model in `prisma/schema.prisma`
  - Fields: `id`, `fullName`, `cpf`, `email`, `favoriteColor`, `observations`, `createdAt`
  - Unique constraints on `cpf` and `email`
- [ ] Create initial migration
- [ ] Verify schema with `bun run db:generate`

## Phase 2: API Layer

- [ ] Create validation schemas in `app/lib/validations/customer.ts`
  - Zod schema for customer input
  - CPF format validation (XXX.XXX.XXX-XX or 11 digits)
  - Email format validation
  - Color enum (rainbow colors)
- [ ] Create `POST /api/customers` route handler
  - Request body validation
  - Duplicate check (CPF/email)
  - Database insert
  - Proper error responses (400, 409, 500)
- [ ] Test API with manual requests

## Phase 3: UI Components

- [ ] Set up ShadCN UI base components
  - Button, Input, Label, Select, Textarea
  - Form components (Form, FormField, FormItem, FormMessage)
- [ ] Create color options constant (`RAINBOW_COLORS`)
- [ ] Build `CustomerForm` component
  - react-hook-form integration
  - Zod resolver for client validation
  - All required fields with proper labels
  - Submit handler with API call
- [ ] Add loading and error states
- [ ] Add success feedback (toast or redirect)

## Phase 4: Page Integration

- [ ] Create main page with form
- [ ] Style with Tailwind (responsive, centered layout)
- [ ] Test full flow: form → API → database

## Phase 5: Docker & Polish

- [ ] Verify `docker-compose.yml` works for full stack
- [ ] Test `docker compose up` from clean state
- [ ] Add basic error boundary
- [ ] Final cleanup and README update

---

## Acceptance Criteria

- [ ] Form submits successfully and persists to PostgreSQL
- [ ] Duplicate CPF/email shows user-friendly error
- [ ] Validation errors display inline
- [ ] Success state is clearly communicated
- [ ] `docker compose up` starts working application
- [ ] Code is clean and maintainable
