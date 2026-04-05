# OmniCalc — System Architecture

> **Version:** 0.4.0
> **Last Updated:** 2026-04-05
> **Status:** Standard 2026 Architecture

---

## 1. Architecture Overview

OmniCalc follows a **monorepo architecture** managed by Turborepo with a **centralized NestJS backend** serving all frontend platforms. **Mobile (Expo + React Native) is the single source of truth** for the UI.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND PLATFORMS                                │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  apps/web/   │  │ apps/mobile/ │  │    apps/desktop/         │  │
│  │  Next.js     │  │ Expo SDK 52  │  │    Electron + React      │  │
│  │  App Router  │  │ Expo Router  │  │    (main + renderer)     │  │
│  │  :3000       │  │ :19006       │  │    :3000 (loads web)     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────────┘  │
│         │                 │                      │                   │
│         └─────────────────┼──────────────────────┘                   │
│                           │ API calls (REST)                        │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              apps/api/ — NestJS Central API                  │    │
│  │  ┌─────────┐ ┌────────────┐ ┌──────┐ ┌────────┐            │    │
│  │  │  Auth   │ │Calculation │ │Users │ │Billing │            │    │
│  │  │ Module  │ │  Module    │ │Module│ │ Module │            │    │
│  │  └─────────┘ └────────────┘ └──────┘ └────────┘            │    │
│  │  Port: 3001  │  Swagger: /api/docs                          │    │
│  └───────────────────────┬─────────────────────────────────────┘    │
│                          │                                           │
│                          ▼                                           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              packages/db — Prisma + PostgreSQL               │    │
│  │              Neon Serverless (cloud)                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Structure

```
omnicalc/
├── apps/
│   ├── api/                    # NestJS central API server
│   │   ├── src/
│   │   │   ├── auth/          # Authentication (Better Auth integration)
│   │   │   ├── calculations/  # CRUD for calculation history
│   │   │   ├── users/         # User management
│   │   │   ├── billing/       # Stripe webhooks + subscriptions
│   │   │   └── common/        # Guards, filters, interceptors
│   │   └── test/              # Jest E2E tests
│   │
│   ├── web/                    # Next.js App Router (SaaS + Landing)
│   │   ├── src/app/           # App Router pages
│   │   └── package.json       # Tailwind CSS + Shadcn UI
│   │
│   ├── mobile/                 # Expo — UI source of truth
│   │   ├── app/               # Expo Router screens
│   │   ├── stores/            # Zustand stores
│   │   ├── lib/               # Auth, API client
│   │   └── dist/              # Web export (generated)
│   │
│   └── desktop/               # Electron + React
│       ├── main/              # Electron main process
│       └── renderer/          # React renderer (loads web)
│
├── packages/
│   ├── ui/                    # Shared NativeWind components
│   │   └── src/
│   │       ├── Button/
│   │       ├── Display/
│   │       ├── Keypad/
│   │       ├── HistoryPanel/
│   │       └── ThemeProvider/
│   │
│   ├── shared-types/          # Frontend ↔ Backend contract
│   │   └── src/
│   │       ├── schemas.ts     # Zod validation schemas
│   │       ├── types.ts       # TypeScript interfaces
│   │       └── index.ts       # Public API
│   │
│   ├── core-math/             # Pure math engine (no UI deps)
│   │   └── src/
│   │       ├── calculator.ts
│   │       ├── operations.ts
│   │       ├── scientific.ts
│   │       └── parser.ts
│   │
│   ├── db/                    # Prisma schema + client
│   │   └── prisma/schema.prisma
│   │
│   └── tsconfig/              # Shared TypeScript configs
│       ├── base.json
│       ├── node.json
│       └── react.json
│
├── docs/
│   ├── adr/                   # Architecture Decision Records
│   ├── design-system.md       # Visual design tokens
│   └── math-engine.md         # Math engine specifications
│
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

---

## 3. Data Flow

### 3.1 API Request Flow

```
Client (Web/Mobile/Desktop)
        │
        ▼ POST /api/calculations
┌─────────────────┐
│  NestJS API     │  ← Validates with Zod from @omnicalc/shared-types
│  (:3001)        │  ← Auth guard checks Better Auth session
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Prisma Client  │  ← Type-safe database query
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Neon PostgreSQL│  ← INSERT into calculations table
└─────────────────┘
```

### 3.2 Shared Types Flow

```
packages/shared-types/
├── schemas.ts    ← Zod schemas (single source of truth for validation)
└── types.ts      ← TypeScript interfaces (derived from schemas)
        │
        ├──→ apps/api/       ← NestJS DTOs, request validation
        ├──→ apps/web/       ← Next.js form validation, API types
        ├──→ apps/mobile/    ← React Native form validation
        └──→ apps/desktop/   ← Electron form validation
```

---

## 4. Running the App

### Development Mode

```bash
# Terminal 1: NestJS API server
pnpm dev:api          # → http://localhost:3001
                      # → Swagger: http://localhost:3001/api/docs

# Terminal 2: Next.js web app
pnpm dev:web          # → http://localhost:3000

# Terminal 3: Expo mobile dev
pnpm dev:mobile       # → http://localhost:19006

# Terminal 4: Electron desktop
pnpm dev:desktop      # → Desktop window

# Or run all at once:
pnpm dev
```

### Production Build

```bash
pnpm build            # Build all packages and apps
```

---

## 5. Key Principles

### 5.1 Single Source of Truth

- **UI**: `apps/mobile/` — all visual components originate here
- **Types**: `packages/shared-types/` — Zod schemas + TS types shared across all apps
- **Math**: `packages/core-math/` — pure functions, zero dependencies on UI
- **Database**: `packages/db/` — single Prisma schema

### 5.2 Validation Contract

All API inputs are validated with Zod schemas from `@omnicalc/shared-types`:

```ts
// packages/shared-types/src/schemas.ts
export const calculationCreateSchema = z.object({
  expression: z.string().min(1),
  result: z.string().min(1),
  deviceOrigin: z.enum(['web', 'ios', 'android', 'desktop']).optional(),
});

// apps/api/src/calculations/calculations.controller.ts
@Post()
create(@Body() dto: z.infer<typeof calculationCreateSchema>) {
  // dto is already validated
}

// apps/mobile/app/index.tsx
const schema = calculationCreateSchema; // Same schema, same validation
```

### 5.3 Platform-Specific Files

When different behavior is needed per platform, use Expo's file extensions:

- `Component.tsx` — shared (default)
- `Component.web.tsx` — web/desktop override
- `Component.native.tsx` — mobile override

---

## 6. Deployment

| Platform    | Source          | Output        | Deployment      |
| ----------- | --------------- | ------------- | --------------- |
| **API**     | `apps/api/`     | NestJS bundle | Railway/Render  |
| **Web**     | `apps/web/`     | Next.js build | Vercel          |
| **iOS**     | `apps/mobile/`  | Native app    | Expo EAS        |
| **Android** | `apps/mobile/`  | APK/AAB       | Expo EAS        |
| **Desktop** | `apps/desktop/` | Electron      | GitHub Releases |

---

## 7. External Services

| Service     | Purpose                            | Config               |
| ----------- | ---------------------------------- | -------------------- |
| Neon        | PostgreSQL database                | `DATABASE_URL`       |
| Better Auth | Authentication                     | `BETTER_AUTH_SECRET` |
| Stripe      | Web/Desktop payments               | `STRIPE_SECRET_KEY`  |
| RevenueCat  | Mobile payments (iOS/Android)      | `REVENUECAT_API_KEY` |
| Expo EAS    | Mobile builds + push notifications | Expo account         |

---

## 8. Architecture Decision Records

| Decision                | Record                                           |
| ----------------------- | ------------------------------------------------ |
| Monorepo with Turborepo | [ADR-001](docs/adr/001-monorepo-turborepo.md)    |
| Prisma over Drizzle ORM | [ADR-002](docs/adr/002-prisma-over-drizzle.md)   |
| Decimal.js for math     | [ADR-003](docs/adr/003-decimal-js-for-math.md)   |
| Better Auth             | [ADR-004](docs/adr/004-better-auth.md)           |
| Dual payment strategy   | [ADR-005](docs/adr/005-dual-payment-strategy.md) |
| NestJS as central API   | [ADR-006](docs/adr/006-nestjs-api.md)            |
| Next.js for web         | [ADR-007](docs/adr/007-nextjs-web.md)            |

---

_Document version: 0.4.0 — Standard 2026 Architecture_
