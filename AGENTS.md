# OmniCalc

## Build & Test

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all apps in development mode
pnpm dev:web          # Start web/BFF only
pnpm dev:mobile       # Start Expo (mobile + web)
pnpm dev:desktop      # Start Electron desktop app
pnpm build            # Build all packages and apps
pnpm test             # Run all tests (Vitest)
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm lint             # Lint (ESLint) and format (Prettier)
pnpm lint:fix         # Auto-fix lint issues
pnpm type-check       # TypeScript type checking
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run Prisma migrations
pnpm db:studio        # Open Prisma Studio
pnpm clean            # Remove all build artifacts
```

## Stack

- **Language:** TypeScript 5.7+ (strict mode)
- **Runtime:** Node.js 22 LTS
- **Package Manager:** pnpm 9+
- **Monorepo:** Turborepo
- **Mobile + Web:** Expo SDK 52 + Expo Router
- **Desktop:** Electron 34 + React (Vite)
- **UI:** NativeWind 4 + Gluestack UI
- **State:** Zustand 5
- **Data Fetching:** TanStack Query 5
- **Backend (BFF):** Hono 4
- **ORM:** Prisma 6
- **Database:** PostgreSQL 16 (Neon Serverless)
- **Auth:** Better Auth
- **Payments:** Stripe + RevenueCat
- **Math:** decimal.js
- **Testing:** Vitest 3 + Playwright + Maestro
- **Linting:** ESLint 9 + Prettier 3 + Husky 9 + lint-staged
- **CI/CD:** GitHub Actions + Expo EAS
- **Monitoring:** Sentry

## Project Structure

```
omnicalc/
├── apps/
│   ├── web/              # Hono BFF (API routes + landing page)
│   ├── mobile/           # Expo (iOS, Android, Web)
│   └── desktop/          # Electron (Windows, macOS, Linux)
├── packages/
│   ├── ui/               # Shared NativeWind + Gluestack components
│   ├── core-math/        # Pure math engine (decimal.js) — NO React deps
│   ├── db/               # Prisma schema, client, migrations
│   └── tsconfig/         # Shared TypeScript configs
├── docs/                 # Extended documentation
├── .agents/              # AI agent skills
└── .github/              # CI/CD workflows
```

## Conventions

### File Organization

- **Shared UI components** → `packages/ui/src/` (NativeWind)
- **Math logic** → `packages/core-math/src/` (pure TypeScript, zero UI deps)
- **Database** → `packages/db/` (Prisma schema + client)
- **API routes** → `apps/web/src/routes/`
- **Platform-specific layouts** → `apps/<platform>/components/`
- **Stores** → `apps/mobile/stores/` or `apps/desktop/renderer/stores/`

### Naming

- Components: `PascalCase` — one component per file
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- Stores: `use<Name>Store.ts` (e.g., `useCalculatorStore.ts`)
- API routes: `kebab-case` (e.g., `/api/calculations`)
- Types: `PascalCase` — `interface` preferred over `type` for objects

### TypeScript

- Strict mode enforced — no `any`, no `@ts-ignore`, no `as` casting unless unavoidable
- Explicit return types on all exported functions
- Use types inferred from Prisma schema — never duplicate DB types manually
- Prefer `async/await` over Promise chains

### Math Engine Rules

- **NEVER** use native JS arithmetic (`+`, `-`, `*`, `/`) for floating-point math
- **ALWAYS** use `decimal.js` for all calculations in `packages/core-math`
- All math functions must be pure (no side effects, no external state)
- Every math function requires a corresponding Vitest unit test

### Validation

- Use Zod for all API input validation
- Share Zod schemas between client and server when possible

### Styling

- All visual components must use NativeWind classes
- Follow design tokens in `docs/design-system.md`
- Never hardcode colors or spacing — always use design tokens

## Git Workflow

- **Branch:** `<type>/<short-description>` (e.g., `feature/cloud-tape`, `fix/division-by-zero`)
- **Commits:** Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`)
- **Scope:** Use package name as scope (e.g., `feat(core-math): add sin/cos/tan`)
- **Merge:** Squash-merge into `main`
- **CI:** All PRs must pass lint + test + type-check

## Boundaries

### Always Do

- Run `pnpm lint` and `pnpm test` before committing
- Use `decimal.js` for any arithmetic in `packages/core-math`
- Validate all API inputs with Zod
- Write tests for new functionality
- Follow the design system for UI changes

### Ask First

- Before adding new production dependencies
- Before modifying the Prisma schema
- Before changing the monorepo structure
- Before modifying CI/CD workflows
- Before changing authentication or payment flows

### Never Do

- Never commit `.env` files or secrets
- Never use `any` type in TypeScript
- Never use native JS arithmetic for calculations
- Never create UI components directly in `apps/` — use `packages/ui/`
- Never bypass Prisma with raw SQL queries
- Never modify `packages/core-math` without updating tests
- Never import server-only code into client bundles

## External Services

| Service     | Purpose              | Config               |
| ----------- | -------------------- | -------------------- |
| Neon        | PostgreSQL database  | `DATABASE_URL`       |
| Better Auth | Authentication       | `BETTER_AUTH_SECRET` |
| Stripe      | Web/Desktop payments | `STRIPE_SECRET_KEY`  |
| RevenueCat  | Mobile payments      | `REVENUECAT_API_KEY` |
| Resend      | Transactional emails | `RESEND_API_KEY`     |
| Sentry      | Error monitoring     | `SENTRY_DSN`         |
| Expo EAS    | Mobile build/deploy  | Expo account         |
| Vercel      | Web hosting          | Vercel project       |

## Key Files

| File                    | Purpose                    |
| ----------------------- | -------------------------- |
| `SPEC.md`               | What the system must do    |
| `ARCHITECTURE.md`       | How the system is built    |
| `ROADMAP.md`            | Project milestones         |
| `PLANNING.md`           | Current sprint tasks       |
| `AI_WORKFLOW.md`        | AI dev pipeline            |
| `docs/design-system.md` | Visual design tokens       |
| `docs/math-engine.md`   | Math engine specifications |
