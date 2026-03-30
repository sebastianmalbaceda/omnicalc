---
name: database-migration
description: |
  Trigger when: modifying the Prisma schema, creating new database tables,
  adding columns, or running migrations.
  Do NOT trigger for: reading data, API route changes (use create-api-endpoint),
  or frontend-only changes.
---

# Database Migration — OmniCalc

## ORM & Database

- **ORM:** Prisma 6
- **Database:** PostgreSQL 16 (Neon Serverless)
- **Schema location:** `packages/db/prisma/schema.prisma`
- **Client location:** `packages/db/src/client.ts`

## Migration Workflow

### Step 1: Modify Schema

Edit `packages/db/prisma/schema.prisma`:

```prisma
model User {
  id                 String   @id @default(uuid())
  email              String   @unique
  name               String?
  avatarUrl          String?  @map("avatar_url")
  createdAt          DateTime @default(now()) @map("created_at")
  stripeCustomerId   String?  @unique @map("stripe_customer_id")
  plan               String   @default("free")
  subscriptionStatus String?  @map("subscription_status")

  calculations Calculation[]
  settings     UserSettings?

  @@map("users")
}
```

### Step 2: Generate Migration

```bash
pnpm db:migrate -- --name descriptive_migration_name
# Example: pnpm db:migrate -- --name add_calculations_table
```

### Step 3: Generate Client

```bash
pnpm db:generate
```

### Step 4: Verify

```bash
# Open Prisma Studio to inspect
pnpm db:studio

# Run tests
pnpm test
```

## Naming Conventions

- Table names: `snake_case` plural (via `@@map`)
- Column names: `snake_case` (via `@map`)
- Model names: `PascalCase` singular (Prisma convention)
- Migration names: `snake_case` descriptive (e.g., `add_user_settings`)

## Checklist

- [ ] Schema changes in `packages/db/prisma/schema.prisma`
- [ ] Migration created with descriptive name
- [ ] Prisma client regenerated
- [ ] Types imported from `@omnicalc/db` (never duplicated)
- [ ] `SPEC.md` data schema section updated if structure changed
- [ ] No raw SQL — use Prisma schema migrations only
- [ ] Seed data updated if needed (`packages/db/prisma/seed.ts`)
- [ ] **Ask first** before modifying existing tables in production

## Important Rules

1. **Never duplicate types** — import from Prisma's generated types
2. **Never use raw SQL** — all queries through Prisma client
3. **Always use `@map`** for snake_case DB columns
4. **Always generate client** after schema changes
5. **Back up data** before destructive migrations
