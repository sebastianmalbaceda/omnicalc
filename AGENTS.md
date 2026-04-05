# OmniCalc

## Build & Test

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all apps in development mode
pnpm dev:api          # Start NestJS API server (:3001)
pnpm dev:web          # Start Next.js web app (:3000)
pnpm dev:mobile       # Start Expo dev server (mobile + web on :19006)
pnpm dev:desktop      # Start Electron desktop app
pnpm build            # Build all packages and apps
pnpm test             # Run all tests (Vitest + Jest)
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
- **Web (SaaS & Landing):** Next.js (App Router)
- **Mobile:** Expo SDK 52 + Expo Router (iOS, Android, Web)
- **Desktop:** Electron 34 + React
- **Backend (API):** NestJS 11
- **UI Shared:** NativeWind 4 (Tailwind for React Native) + Shadcn UI (web)
- **State:** Zustand 5 (local) + TanStack Query (API data)
- **Forms:** React Hook Form + Zod
- **ORM:** Prisma 6
- **Database:** PostgreSQL 16 (Neon Serverless)
- **Auth:** Better Auth
- **Payments:** Stripe (web/desktop) + RevenueCat (mobile)
- **Math:** decimal.js
- **Testing:** Vitest 3 (packages) + Jest (NestJS)
- **Linting:** ESLint 9 + Prettier 3 + Husky 9 + lint-staged
- **CI/CD:** GitHub Actions + Expo EAS

## Project Structure

```
omnicalc/
├── apps/
│   ├── api/              # NestJS central API server
│   ├── web/              # Next.js App Router (SaaS + Landing)
│   ├── mobile/           # Expo — UI source of truth (iOS, Android, Web)
│   └── desktop/          # Electron + React
├── packages/
│   ├── ui/               # Shared NativeWind components
│   ├── shared-types/     # Zod schemas + TS types (frontend ↔ backend contract)
│   ├── core-math/        # Pure math engine (decimal.js) — NO React deps
│   ├── db/               # Prisma schema, client, migrations
│   └── tsconfig/         # Shared TypeScript configs
├── docs/                 # Extended documentation
├── .agents/              # AI agent skills
└── .github/              # CI/CD workflows
```

## Architecture

**Mobile is the single source of truth for UI.** All visual components live in `apps/mobile/`.
The API server (`apps/api/`) is the central backend serving all platforms.

```
┌──────────────────────────────────────────────────────┐
│                 apps/mobile/                          │
│            (Expo — UI Source of Truth)                │
│  ┌──────────────────────────────────────────────┐    │
│  │  React Native + Expo Router                  │    │
│  │  • Calculator screen                         │    │
│  │  • Login/Register screens                    │    │
│  │  • Zustand stores + TanStack Query           │    │
│  └──────────────────────────────────────────────┘    │
│         │                    │                       │
│         │ expo export        │ API calls             │
│         ▼                    ▼                       │
│  ┌──────────────┐    ┌──────────────┐               │
│  │  mobile/dist │    │  apps/api/   │               │
│  │  (SPA)       │    │  (NestJS)    │               │
│  └──────────────┘    └──────────────┘               │
│         │                    │                       │
│    ┌────┴─────┐         ┌───┴────┐                  │
│    ▼          ▼         ▼        ▼                  │
│  Web       Desktop    Stripe   Neon DB              │
│  (Next.js) (Electron)  RevCat  (PostgreSQL)         │
└──────────────────────────────────────────────────────┘
```

## Conventions

### File Organization

- **All UI** → `apps/mobile/app/` (Expo Router screens)
- **Shared UI components** → `packages/ui/src/` (NativeWind)
- **Shared types/schemas** → `packages/shared-types/src/` (Zod + TS)
- **Math logic** → `packages/core-math/src/` (pure TypeScript, zero UI deps)
- **Database** → `packages/db/` (Prisma schema + client)
- **API routes** → `apps/api/src/` (NestJS modules)
- **Stores** → `apps/mobile/stores/`
- **Electron main** → `apps/desktop/main/`

### Naming

- Components: `PascalCase` — one component per file
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- Stores: `use<Name>Store.ts` (e.g., `useCalculatorStore.ts`)
- API routes: NestJS controllers with `@Controller('resource-name')`
- Types: `PascalCase` — `interface` preferred over `type` for objects

### TypeScript

- Strict mode enforced — no `any`, no `@ts-ignore`, no `as` casting unless unavoidable
- Explicit return types on all exported functions
- Use types from `@omnicalc/shared-types` — never duplicate API types manually
- Prefer `async/await` over Promise chains

### Math Engine Rules

- **NEVER** use native JS arithmetic (`+`, `-`, `*`, `/`) for floating-point math
- **ALWAYS** use `decimal.js` for all calculations in `packages/core-math`
- All math functions must be pure (no side effects, no external state)
- Every math function requires a corresponding Vitest unit test

### Validation

- Use Zod schemas from `@omnicalc/shared-types` for all API input validation
- Share Zod schemas between client and server — single source of truth
- React Hook Form + Zod resolver for all client-side forms

### Styling

- All visual components must use NativeWind classes (mobile) or Tailwind (web)
- Follow design tokens in `docs/design-system.md`
- Never hardcode colors or spacing — always use design tokens

### Platform-Specific Files

When different behavior is needed per platform, use Expo's file extensions:

- `Component.tsx` — shared (default)
- `Component.web.tsx` — web/desktop override
- `Component.native.tsx` — mobile override

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
- Validate all API inputs with Zod schemas from `@omnicalc/shared-types`
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
- Never create UI components directly in `apps/` — use `packages/ui/` or `apps/mobile/`
- Never bypass Prisma with raw SQL queries
- Never modify `packages/core-math` without updating tests
- Never import server-only code into client bundles
- Never duplicate Zod schemas — always use `@omnicalc/shared-types`

## External Services

| Service     | Purpose              | Config               |
| ----------- | -------------------- | -------------------- |
| Neon        | PostgreSQL database  | `DATABASE_URL`       |
| Better Auth | Authentication       | `BETTER_AUTH_SECRET` |
| Stripe      | Web/Desktop payments | `STRIPE_SECRET_KEY`  |
| RevenueCat  | Mobile payments      | `REVENUECAT_API_KEY` |
| Resend      | Transactional emails | `RESEND_API_KEY`     |
| Expo EAS    | Mobile build/deploy  | Expo account         |

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
