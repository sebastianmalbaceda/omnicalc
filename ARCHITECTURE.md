# OmniCalc — System Architecture

> **Version:** 0.1.0
> **Last Updated:** 2026-03-30
> **Status:** Draft

---

## 1. Architecture Overview

OmniCalc follows a **monorepo architecture** managed by Turborepo. The system is split into three application targets and four shared packages, all written in TypeScript.

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTS                              │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Web/BFF  │  │   Mobile     │  │    Desktop        │  │
│  │ (Hono)   │  │ (Expo)       │  │ (Electron+React)  │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬──────────┘  │
│       │               │                   │              │
│       └───────────────┼───────────────────┘              │
│                       │                                  │
│              ┌────────▼────────┐                         │
│              │  Shared Layer   │                         │
│              │  ┌────────────┐ │                         │
│              │  │ packages/  │ │                         │
│              │  │ ui         │ │                         │
│              │  │ core-math  │ │                         │
│              │  │ db         │ │                         │
│              │  │ tsconfig   │ │                         │
│              │  └────────────┘ │                         │
│              └────────┬────────┘                         │
└───────────────────────┼─────────────────────────────────┘
                        │
             ┌──────────▼──────────┐
             │   External Services │
             │  ┌───────────────┐  │
             │  │ Neon Postgres │  │
             │  │ Stripe        │  │
             │  │ RevenueCat    │  │
             │  │ Better Auth   │  │
             │  └───────────────┘  │
             └─────────────────────┘
```

---

## 2. Monorepo Structure

```
omnicalc/
├── apps/
│   ├── web/                  # Hono BFF + Landing Page
│   │   ├── src/
│   │   │   ├── routes/       # API routes (auth, calculations, payments, webhooks)
│   │   │   ├── pages/        # Landing page (SSR or static)
│   │   │   ├── middleware/   # Auth guards, rate limiting, CORS
│   │   │   └── lib/          # Server utilities
│   │   └── package.json
│   │
│   ├── mobile/               # Expo (iOS + Android + Web)
│   │   ├── app/              # Expo Router file-based routing
│   │   ├── components/       # Platform-specific layout wrappers
│   │   ├── stores/           # Zustand stores
│   │   └── package.json
│   │
│   └── desktop/              # Electron
│       ├── main/             # Electron main process
│       ├── renderer/         # React app (Vite)
│       ├── preload/          # Preload scripts (IPC bridge)
│       └── package.json
│
├── packages/
│   ├── ui/                   # Shared visual components
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Display/
│   │   │   ├── Keypad/
│   │   │   ├── HistoryPanel/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── core-math/            # Pure math engine
│   │   ├── src/
│   │   │   ├── calculator.ts     # Main engine
│   │   │   ├── operations.ts     # Basic operations
│   │   │   ├── scientific.ts     # Scientific functions
│   │   │   ├── parser.ts         # Expression parser
│   │   │   └── constants.ts      # Mathematical constants
│   │   ├── __tests__/
│   │   └── package.json
│   │
│   ├── db/                   # Database layer
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── tsconfig/             # Shared TS configs
│       ├── base.json
│       ├── react.json
│       ├── node.json
│       └── package.json
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── eslint.config.js
├── .prettierrc
```

---

## 3. Component Responsibilities

### 3.1 `apps/web` — Backend for Frontend (BFF)

- **Framework:** Hono
- **Deployment:** Vercel (or Railway)
- **Responsibilities:**
  - API routes for authentication (Better Auth integration)
  - API routes for CRUD operations on calculations and settings
  - Stripe webhook handler
  - RevenueCat webhook handler
  - Landing page serving
  - CORS, rate limiting, and security middleware

### 3.2 `apps/mobile` — Expo Universal App

- **Framework:** Expo + Expo Router
- **Deployment:** Expo EAS (iOS/Android) + Vercel (Web export)
- **Responsibilities:**
  - Universal calculator UI (iOS, Android, Web)
  - Zustand state management
  - TanStack Query for API communication
  - RevenueCat SDK for mobile payments
  - Offline-first calculation storage

### 3.3 `apps/desktop` — Electron App

- **Framework:** Electron + React (Vite)
- **Deployment:** GitHub Releases via GitHub Actions
- **Responsibilities:**
  - Native desktop experience (Windows, macOS, Linux)
  - Reuses `packages/ui` and `packages/core-math`
  - Stripe payment flow (opens browser for Checkout)
  - Auto-update mechanism via Electron Updater

### 3.4 `packages/core-math` — Math Engine

- **Pure TypeScript** — zero React/UI dependencies
- **Library:** decimal.js for all arithmetic
- **Responsibilities:**
  - All mathematical operations (basic + scientific)
  - Expression parsing and evaluation
  - Error handling (division by zero, overflow)
  - 100% unit test coverage target
- **Key rule:** No native JS arithmetic operators (`+`, `-`, `*`, `/`) for float calculations

### 3.5 `packages/ui` — Shared Components

- **Styling:** NativeWind (Tailwind for React Native) + Gluestack UI
- **Responsibilities:**
  - Button, Display, Keypad, HistoryPanel components
  - Design tokens (colors, typography, spacing)
  - Responsive layouts
  - Accessibility (a11y) compliance

### 3.6 `packages/db` — Database Layer

- **ORM:** Prisma
- **Database:** PostgreSQL on Neon Serverless
- **Responsibilities:**
  - Prisma schema definition
  - Generated Prisma Client for type-safe queries
  - Database migrations
  - Seed data for development

---

## 4. Data Flow

### 4.1 Calculation Flow (Pro User)

```
User presses "=" on any device
        │
        ▼
┌─────────────────┐
│ core-math engine │  ← Evaluates expression with decimal.js
│ (pure function)  │
└────────┬────────┘
         │ returns { expression, result }
         ▼
┌─────────────────┐
│ Zustand Store    │  ← Updates UI state (currentValue, expression)
│ (useCalcStore)   │  ← Saves to local queue
└────────┬────────┘
         │ background mutation
         ▼
┌─────────────────┐
│ TanStack Query   │  ← POST /api/calculations
│ (mutation)       │  ← Retry with exponential backoff on failure
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Hono BFF         │  ← Validates auth, checks Pro status
│ (API route)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prisma → Neon    │  ← INSERT into calculations table
│ (PostgreSQL)     │
└─────────────────┘
```

### 4.2 Payment Flow (Web/Desktop → Stripe)

```
User clicks "Upgrade to Pro"
        │
        ▼
POST /api/payments/checkout  →  Stripe creates Checkout Session
        │                               │
        ▼                               ▼
Redirect to Stripe Checkout    User completes payment
        │                               │
        ▼                               ▼
Stripe fires webhook  →  POST /api/webhooks/stripe
        │
        ▼
Server updates users.plan = 'pro'
        │
        ▼
Client refetches session → UI expands to Pro mode
```

### 4.3 Payment Flow (Mobile → RevenueCat)

```
User clicks "Upgrade to Pro" (iOS/Android)
        │
        ▼
RevenueCat SDK presents native paywall
        │
        ▼
Apple/Google processes payment (15-30% commission)
        │
        ▼
RevenueCat fires webhook  →  POST /api/webhooks/revenuecat
        │
        ▼
Server updates users.plan = 'pro'
        │
        ▼
Client validates entitlement → UI expands to Pro mode
```

---

## 5. Security Architecture

| Concern            | Mechanism                                                |
| ------------------ | -------------------------------------------------------- |
| Authentication     | Better Auth (JWT sessions, secure cookies)               |
| API Authorization  | Middleware validates session before protected routes     |
| Pro Feature Gating | Server-side check on `users.plan` for all Pro endpoints  |
| Webhook Security   | Stripe signature verification, RevenueCat webhook secret |
| Input Validation   | Zod schemas on all API inputs                            |
| SQL Injection      | Prisma parameterized queries (never raw SQL)             |
| CORS               | Strict origin allowlist                                  |
| Rate Limiting      | Per-IP and per-user limits on API routes                 |
| Secrets            | Environment variables only, never committed              |

---

## 6. Key Architecture Decisions

| Decision                | Record                                         |
| ----------------------- | ---------------------------------------------- |
| Monorepo with Turborepo | [ADR-001](docs/adr/001-monorepo-turborepo.md)  |
| Prisma over Drizzle ORM | [ADR-002](docs/adr/002-prisma-over-drizzle.md) |
| Electron over Tauri     | [ADR-003](docs/adr/003-electron-over-tauri.md) |
| Hono as BFF             | [ADR-004](docs/adr/004-hono-as-bff.md)         |
| Better Auth             | [ADR-005](docs/adr/005-better-auth.md)         |

---

## 7. Deployment Architecture

| Component         | Platform           | Trigger           |
| ----------------- | ------------------ | ----------------- |
| Web + BFF         | Vercel             | Push to `main`    |
| Database          | Neon Serverless    | Prisma migrations |
| Mobile (iOS)      | App Store via EAS  | Release tag       |
| Mobile (Android)  | Play Store via EAS | Release tag       |
| Desktop (Windows) | GitHub Releases    | Release tag       |
| Desktop (macOS)   | GitHub Releases    | Release tag       |
| Desktop (Linux)   | GitHub Releases    | Release tag       |

---

_Document version: 0.1.0_
