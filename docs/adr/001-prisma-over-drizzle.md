# ADR-001: Prisma over Drizzle for ORM

- **Status:** Accepted
- **Date:** 2026-03-30
- **Context:** Need a TypeScript ORM for PostgreSQL with type safety, migrations, and good DX.
- **Decision:** Use **Prisma 6** over Drizzle ORM.
- **Rationale:**
  - Prisma has a more mature ecosystem (studio, migrations, introspection)
  - Declarative schema is easier to reason about and review
  - Generated types are battle-tested and widely adopted
  - Better tooling (Prisma Studio) for debugging data
  - Larger community and more learning resources
  - Drizzle's SQL-like API is powerful but adds cognitive overhead for the team
- **Consequences:**
  - Must use Prisma's migration system (no raw SQL migrations)
  - Types must always be imported from Prisma (never duplicated)
  - Build step required to generate client (`pnpm db:generate`)
  - Slightly larger bundle than Drizzle
