# OmniCalc — System Architecture

> **Version:** 1.0.0
> **Last Updated:** 2026-04-13
> **Status:** Production-Ready Multiplatform SaaS

---

## 1. Architecture Overview

OmniCalc follows a **monorepo architecture** managed by Turborepo with a **centralized NestJS backend** serving all frontend platforms. The architecture mirrors industry-standard SaaS patterns used by Spotify, Discord, and Slack:

- **Marketing Site** (`apps/marketing/`) — Next.js for SEO-optimized public pages
- **Web App** (`apps/web/`) — Vite + React SPA for the actual product
- **Mobile** (`apps/mobile/`) — Expo + React Native (UI source of truth)
- **Desktop** (`apps/desktop/`) — Electron wrapping the web SPA
- **API** (`apps/api/`) — NestJS central backend

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND PLATFORMS                                  │
│                                                                              │
│  ┌────────────────────┐  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │  apps/marketing/   │  │   apps/web/     │  │    apps/mobile/          │  │
│  │ Next.js (SSR/SSG)  │  │  Vite + React   │  │    Expo + React Native   │  │
│  │ :3000              │  │  SPA :3002      │  │    :19006                │  │
│  │ SEO, Landing,      │  │  Product UI      │  │    iOS, Android, Web     │  │
│  │ Pricing, Downloads │  │  (browser)       │  │                          │  │
│  └────────┬───────────┘  └────────┬────────┘  └──────────┬───────────────┘  │
│           │                      │                       │                   │
│           │ Auth redirect        │ API calls             │ API calls         │
│           └──────────────────────┼───────────────────────┘                   │
│                                  │                                           │
│                                  ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              apps/api/ — NestJS Central API (:3001)                  │    │
│  │  ┌─────────┐ ┌────────────┐ ┌──────┐ ┌────────┐                    │    │
│  │  │  Auth   │ │Calculation │ │Users │ │Billing │                    │    │
│  │  │ Module  │ │  Module    │ │Module│ │ Module │                    │    │
│  │  └─────────┘ └────────────┘ └──────┘ └────────┘                    │    │
│  │  Swagger: /api/docs                                                 │    │
│  └───────────────────────┬─────────────────────────────────────────────┘    │
│                          │                                                   │
│                          ▼                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              packages/db — Prisma + PostgreSQL                       │    │
│  │              Neon Serverless (cloud)                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              apps/desktop/ — Electron                                │    │
│  │              Loads apps/web/ SPA (:3002)                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Structure

```
omnicalc/
├── apps/
│   ├── api/                    # NestJS central API server (:3001)
│   │   ├── src/
│   │   │   ├── auth/          # Authentication (Better Auth integration)
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── dto/
│   │   │   ├── calculations/  # CRUD for calculation history
│   │   │   ├── users/         # User management + settings
│   │   │   ├── billing/       # Stripe webhooks + subscriptions
│   │   │   └── common/        # Guards, filters, interceptors
│   │   └── test/              # Jest E2E tests
│   │
│   ├── marketing/              # Next.js — SEO & Marketing (:3000)
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   │   ├── page.tsx   # Landing page
│   │   │   │   ├── pricing/   # Pricing page
│   │   │   │   ├── downloads/ # Downloads page
│   │   │   │   ├── sign-in/   # Sign in page
│   │   │   │   └── sign-up/   # Sign up page
│   │   │   └── components/    # Marketing components
│   │   └── public/            # Static assets
│   │
│   ├── web/                    # Vite + React SPA — Product (:3002)
│   │   ├── src/
│   │   │   ├── App.tsx        # Main calculator app
│   │   │   ├── stores/        # Zustand stores
│   │   │   └── lib/           # Auth client
│   │   └── public/            # Static assets
│   │
│   ├── mobile/                 # Expo — UI source of truth
│   │   ├── app/               # Expo Router screens
│   │   ├── stores/            # Zustand stores
│   │   ├── lib/               # Auth client
│   │   └── dist/              # Web export (generated)
│   │
│   └── desktop/               # Electron + React
│       ├── main/              # Electron main process (loads web)
│       └── preload.js         # Preload script
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
│   │       └── types.ts       # TypeScript interfaces
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

### 3.1 User Journey

```
1. User discovers via Google → tudominio.com (Next.js marketing)
2. User signs up/signs in → redirected to app.tudominio.com (Vite SPA)
3. User downloads desktop app → Electron loads same SPA locally
4. User opens mobile app → Expo app calls NestJS API directly
5. All platforms share the same backend, database, and auth system
```

### 3.2 API Request Flow

```
Client (Web App / Mobile / Desktop)
        │
        ▼ POST /api/calculations
┌─────────────────┐
│  NestJS API     │  ← Validates with Zod from @omnicalc/shared-types
│  (:3001)        │  ← JwtAuthGuard validates Better Auth session
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

### 3.3 Shared Types Flow

```
packages/shared-types/
├── schemas.ts    ← Zod schemas (single source of truth for validation)
└── types.ts      ← TypeScript interfaces (derived from schemas)
        │
        ├──→ apps/api/           ← NestJS DTOs, request validation
        ├──→ apps/marketing/     ← Next.js form validation
        ├──→ apps/web/           ← Vite SPA types
        ├──→ apps/mobile/        ← React Native form validation
        └──→ apps/desktop/       ← Electron types
```

---

## 4. Running the App

### Development Mode

```bash
# Terminal 1: NestJS API server
pnpm dev:api          # → http://localhost:3001
                      # → Swagger: http://localhost:3001/api/docs

# Terminal 2: Next.js marketing site
pnpm dev:marketing    # → http://localhost:3000

# Terminal 3: Vite web app (product)
pnpm dev:web          # → http://localhost:3002

# Terminal 4: Expo mobile dev
pnpm dev:mobile       # → http://localhost:19006

# Terminal 5: Electron desktop
pnpm dev:desktop      # → Desktop window (loads :3002)

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
- **Backend**: `apps/api/` — NestJS is the sole API server

### 5.2 Marketing vs Product Separation

Following industry standards (Spotify, Discord, Slack):

| Aspect          | Marketing Site             | Web App (Product)           |
| --------------- | -------------------------- | --------------------------- |
| **Framework**   | Next.js (SSR/SSG)          | Vite + React (SPA)          |
| **URL**         | tudominio.com              | app.tudominio.com           |
| **Purpose**     | SEO, discovery, conversion | Actual product usage        |
| **Auth**        | Sign-in/Sign-up forms      | Requires authentication     |
| **Performance** | Optimized for first paint  | Optimized for interactivity |

### 5.3 Validation Contract

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
create(@Body() dto: CreateCalculationDto) {
  // dto is already validated by class-validator
}

// apps/mobile/app/index.tsx
const schema = calculationCreateSchema; // Same schema, same validation
```

### 5.4 Platform-Specific Files

When different behavior is needed per platform, use Expo's file extensions:

- `Component.tsx` — shared (default)
- `Component.web.tsx` — web/desktop override
- `Component.native.tsx` — mobile override

---

## 6. Deployment

| Platform      | Source            | Output        | Deployment      | URL                   |
| ------------- | ----------------- | ------------- | --------------- | --------------------- |
| **Marketing** | `apps/marketing/` | Next.js build | Vercel          | tudominio.com         |
| **Web App**   | `apps/web/`       | Vite SPA      | Vercel/Netlify  | app.tudominio.com     |
| **API**       | `apps/api/`       | NestJS bundle | Railway/Render  | api.tudominio.com     |
| **iOS**       | `apps/mobile/`    | Native app    | Expo EAS        | App Store             |
| **Android**   | `apps/mobile/`    | APK/AAB       | Expo EAS        | Google Play           |
| **Desktop**   | `apps/desktop/`   | Electron      | GitHub Releases | omnicalc.app/download |

---

## 7. External Services

| Service     | Purpose                            | Config               |
| ----------- | ---------------------------------- | -------------------- |
| Neon        | PostgreSQL database                | `DATABASE_URL`       |
| Better Auth | Authentication                     | `BETTER_AUTH_SECRET` |
| Stripe      | Web/Desktop payments               | `STRIPE_SECRET_KEY`  |
| RevenueCat  | Mobile payments (iOS/Android)      | `REVENUECAT_API_KEY` |
| Expo EAS    | Mobile builds + push notifications | Expo account         |
| Resend      | Transactional emails               | `RESEND_API_KEY`     |
| Sentry      | Error monitoring                   | `SENTRY_DSN`         |

---

## 8. Architecture Decision Records

| Decision                     | Record                                             |
| ---------------------------- | -------------------------------------------------- |
| Monorepo with Turborepo      | [ADR-001](docs/adr/001-monorepo-turborepo.md)      |
| Prisma over Drizzle ORM      | [ADR-002](docs/adr/002-prisma-over-drizzle.md)     |
| Decimal.js for math          | [ADR-003](docs/adr/003-decimal-js-for-math.md)     |
| Better Auth                  | [ADR-004](docs/adr/004-better-auth.md)             |
| Dual payment strategy        | [ADR-005](docs/adr/005-dual-payment-strategy.md)   |
| NestJS as central API        | [ADR-006](docs/adr/006-nestjs-api.md)              |
| Next.js for marketing        | [ADR-007](docs/adr/007-nextjs-web.md)              |
| Electron over Tauri          | [ADR-008](docs/adr/002-electron-over-tauri.md)     |
| Marketing/Product separation | [ADR-009](docs/adr/009-marketing-product-split.md) |

---

_Document version: 1.0.0 — Production-Ready Multiplatform SaaS Architecture_
