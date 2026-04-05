# OmniCalc — System Architecture

> **Version:** 0.3.0
> **Last Updated:** 2026-04-05
> **Status:** Unified Multiplatform

---

## 1. Architecture Overview

OmniCalc follows a **monorepo architecture** managed by Turborepo. The key principle is that **Mobile (Expo + React Native) is the single source of truth** for the UI, which is then rendered identically on all platforms.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MOBILE (SOURCE OF TRUTH)                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Expo + React Native + Expo Router                          │    │
│  │  • apps/mobile/app/ — all screens (calculator, login)       │    │
│  │  • apps/mobile/stores/ — Zustand state                      │    │
│  │  • apps/mobile/lib/ — auth, API client                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              │ npx expo export --platform web        │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  apps/mobile/dist (Static Web Export — SPA)                │    │
│  │  • Pure HTML + CSS + JavaScript via react-native-web       │    │
│  │  • Works in ANY browser                                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                    │                       │                        │
│     ┌──────────────┘                       └──────────────┐        │
│     ▼                                                     ▼        │
│  ┌──────────────┐                                        ┌─────────┐
│  │  Web Server  │                                        │ Desktop │
│  │  (Hono)      │                                        │ (Elect) │
│  │  :3000       │                                        │ :3000   │
│  │  Serves      │                                        │ Loads   │
│  │  mobile/dist │                                        │ localhost│
│  │  + /api/*    │                                        │         │
│  └──────────────┘                                        └─────────┘
└─────────────────────────────────────────────────────────────────────┘
```

### The Multiplatform Magic: React Native Web

When you write `<View>`, `<Text>`, `<Pressable>` in React Native:

- **iOS**: Translated to `UIView`, `UILabel`, native touchable (100% native)
- **Android**: Translated to `ViewGroup`, `TextView`, native touchable (100% native)
- **Web**: Expo uses `react-native-web` which translates to `<div>`, `<span>`, `<button>`

**You write ONCE, renders EVERYWHERE identically.**

---

## 2. Multiplatform Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  DEVELOPER WORKFLOW                                                 │
│                                                                      │
│  1. Edit code in apps/mobile/ (React Native + Expo)                 │
│                     │                                                │
│                     ▼                                                │
│  2. npx expo export --platform web                                  │
│                     │                                                │
│                     ▼                                                │
│  3. apps/mobile/dist (static SPA files)                             │
│                     │                                                │
│         ┌───────────┴───────────┐                                   │
│         ▼                       ▼                                   │
│  ┌──────────────┐      ┌───────────────┐                           │
│  │ Web Server   │      │ Desktop       │                           │
│  │ (Hono)       │      │ (Electron)    │                           │
│  │ Serves :3000 │      │ Loads :3000   │                           │
│  │ + API routes │      │               │                           │
│  └──────────────┘      └───────────────┘                           │
│                                                                      │
│  USER EXPERIENCE                                                     │
│                                                                      │
│  • Mobile: Native app (iOS/Android) via Expo Go / EAS Build         │
│  • Web: Browser at http://localhost:3000                             │
│  • Desktop: Electron window loading http://localhost:3000            │
│                                                                      │
│  ALL THREE SEE EXACTLY THE SAME UI                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Monorepo Structure

```
omnicalc/
├── apps/
│   ├── mobile/                    # ⭐ SINGLE SOURCE OF TRUTH (UI)
│   │   ├── app/                   # Expo Router pages
│   │   │   ├── _layout.tsx       # Root layout with ThemeProvider
│   │   │   ├── index.tsx         # Calculator screen
│   │   │   └── login.tsx         # Auth screen
│   │   ├── lib/                  # Auth, API client
│   │   ├── stores/               # Zustand stores (calculator, auth)
│   │   ├── global.css            # Design system CSS variables
│   │   └── dist/                 # Web export (generated by expo export)
│   │
│   ├── web/                      # Hono unified server (API + SPA)
│   │   └── src/
│   │       └── server/           # All server code
│   │           ├── dev.ts        # Dev server: serves mobile/dist + API
│   │           ├── serve.ts      # Production server
│   │           ├── index.ts      # Hono app with API routes
│   │           ├── auth.ts       # Better Auth configuration
│   │           └── stripe.ts     # Stripe checkout + webhooks
│   │
│   └── desktop/                  # Electron shell (thin wrapper)
│       └── main/
│           └── index.ts          # Loads http://localhost:3000
│
├── packages/
│   ├── ui/                       # Shared React Native components
│   │   └── src/
│   │       ├── Button/           # Calculator buttons
│   │       ├── Display/          # Calculator display
│   │       ├── Keypad/           # Numeric, Operator, Scientific
│   │       ├── HistoryPanel/     # Cloud Tape history
│   │       ├── ThemeProvider/    # Light/dark theme context
│   │       └── styles/           # Design system CSS
│   │
│   ├── core-math/                # Pure math engine (no UI deps)
│   │   └── src/
│   │       ├── calculator.ts     # State machine
│   │       ├── operations.ts     # +, -, ×, ÷
│   │       ├── scientific.ts     # sin, cos, tan, log, etc.
│   │       ├── parser.ts         # Expression evaluation
│   │       ├── constants.ts      # π, e
│   │       ├── types.ts          # TypeScript types
│   │       └── errors.ts         # Error classes
│   │
│   ├── db/                       # Prisma schema + client
│   │   └── prisma/schema.prisma
│   │
│   └── tsconfig/                 # Shared TypeScript configs
│       ├── base.json
│       ├── node.json
│       └── react.json
│
├── docs/
│   ├── adr/                      # Architecture Decision Records
│   ├── design-system.md          # Visual design tokens
│   └── math-engine.md            # Math engine specifications
│
├── .agents/                      # AI agent skills
├── turbo.json                    # Turborepo config
├── package.json                  # Root scripts
└── pnpm-workspace.yaml
```

---

## 4. Running the App

### Development Mode

```bash
# Terminal 1: Web server (serves mobile/dist SPA + API on :3000)
pnpm dev:web

# Terminal 2: Mobile dev server (Expo with HMR on :19006)
pnpm dev:mobile

# Terminal 3: Desktop (Electron shell loading :3000)
pnpm dev:desktop

# Or run all at once:
pnpm dev
```

### Production Build

```bash
# 1. Export mobile to web (SPA)
cd apps/mobile
npx expo export --platform web

# 2. Build API server
cd apps/web
pnpm build:server

# 3. Build Electron main process
cd apps/desktop
pnpm build

# Or build everything:
pnpm build
```

---

## 5. Key Principles

### 5.1 Single Source of Truth

All UI lives in `apps/mobile/`. Web and desktop consume the same build:

- **Web**: Hono server serves `apps/mobile/dist` as a SPA + handles `/api/*` routes
- **Desktop**: Electron `BrowserWindow` loads `http://localhost:3000`
- **Mobile**: Expo renders natively on iOS/Android

### 5.2 Platform-Specific Files

When you need different behavior per platform, use Expo's file extensions:

```
components/
├── BotonInstalar.tsx        # Shared (default)
├── BotonInstalar.web.tsx    # Web/Desktop overrides
└── BotonInstalar.native.tsx # Mobile overrides
```

### 5.3 Adaptive Design

The same UI adapts to different screen sizes using `useWindowDimensions`:

```tsx
import { useWindowDimensions } from 'react-native';

function AppLayout({ children }) {
  const { width } = useWindowDimensions();

  // Desktop/web: wider layout
  if (width >= 768) {
    return <WideLayout>{children}</WideLayout>;
  }

  // Mobile: compact layout
  return <MobileLayout>{children}</MobileLayout>;
}
```

---

## 6. Deployment

| Platform    | Source                  | Output     | Deployment      |
| ----------- | ----------------------- | ---------- | --------------- |
| **iOS**     | `apps/mobile`           | Native app | Expo EAS        |
| **Android** | `apps/mobile`           | APK/AAB    | Expo EAS        |
| **Web**     | `apps/mobile` → `dist/` | Static SPA | Vercel/Netlify  |
| **Desktop** | `apps/mobile` → `dist/` | Electron   | GitHub Releases |

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

## 8. Data Flow

### 8.1 Calculation Flow

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
│ Zustand Store    │  ← Updates UI state (display, expression)
│ (useCalcStore)   │  ← Adds to history
└────────┬────────┘
         │ (Pro users only — background sync)
         ▼
┌─────────────────┐
│ POST /api/calc   │  ← Save to database
│                  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Prisma → Neon    │  ← INSERT into calculations table
└─────────────────┘
```

### 8.2 Payment Flow (Web/Desktop → Stripe)

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
Client refetches session → UI unlocks Pro features
```

### 8.3 Payment Flow (Mobile → RevenueCat)

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
Client validates entitlement → UI unlocks Pro features
```

---

## 9. Security Architecture

| Concern            | Mechanism                                                |
| ------------------ | -------------------------------------------------------- |
| Authentication     | Better Auth (JWT sessions, secure cookies)               |
| API Authorization  | Middleware validates session before protected routes     |
| Pro Feature Gating | Server-side check on `users.plan` for all Pro endpoints  |
| Webhook Security   | Stripe signature verification, RevenueCat webhook secret |
| Input Validation   | Zod schemas on all API inputs                            |
| SQL Injection      | Prisma parameterized queries (never raw SQL)             |
| CORS               | Strict origin allowlist                                  |
| Secrets            | Environment variables only, never committed              |

---

## 10. Architecture Decision Records

| Decision                | Record                                           |
| ----------------------- | ------------------------------------------------ |
| Monorepo with Turborepo | [ADR-001](docs/adr/001-monorepo-turborepo.md)    |
| Prisma over Drizzle ORM | [ADR-002](docs/adr/002-prisma-over-drizzle.md)   |
| Decimal.js for math     | [ADR-003](docs/adr/003-decimal-js-for-math.md)   |
| Better Auth             | [ADR-004](docs/adr/004-better-auth.md)           |
| Dual payment strategy   | [ADR-005](docs/adr/005-dual-payment-strategy.md) |

---

_Document version: 0.3.0 — Unified multiplatform architecture_
