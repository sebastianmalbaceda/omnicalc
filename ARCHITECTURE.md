# OmniCalc — System Architecture

> **Version:** 0.2.0
> **Last Updated:** 2026-03-31
> **Status:** Production Ready

---

## 1. Architecture Overview

OmniCalc follows a **monorepo architecture** managed by Turborepo. The key innovation is that **Mobile (Expo + React Native) is the single source of truth** for the UI, which is then rendered identically on all platforms.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MOBILE (SOURCE OF TRUTH)                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Expo + React Native + Expo Router                          │    │
│  │  • <View> → UIView (iOS) / ViewGroup (Android)          │    │
│  │  • <Text> → UILabel (iOS) / TextView (Android)          │    │
│  │  • <View> → <div> (Web via react-native-web)             │    │
│  │  • Single codebase for ALL platforms                       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              │ npx expo export --platform web        │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  apps/mobile/dist (Static Web Export)                      │    │
│  │  • Single Page Application (SPA)                           │    │
│  │  • Pure HTML + CSS + JavaScript                           │    │
│  │  • Works in ANY browser                                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                    │                       │                        │
│                    │                       │                        │
│     ┌──────────────┘                       └──────────────┐        │
│     ▼                                                     ▼        │
│  ┌──────────────┐                                        ┌───────┴───────┐
│  │  Web Server │                                        │   Desktop     │
│  │  (Hono)    │                                        │   (Electron)  │
│  │  :3000      │                                        │   :3000       │
│  │  Serves     │                                        │   Loads       │
│  │  mobile/dist│                                        │   localhost    │
│  └──────────────┘                                        └───────────────┘
└─────────────────────────────────────────────────────────────────────┘
```

### The Multiplatform Magic: React Native Web

When you write `<View>` and `<Text>` in React Native:

- **iOS**: Translated to `UIView` and `UILabel` (100% native)
- **Android**: Translated to `ViewGroup` and `TextView` (100% native)
- **Web**: Expo uses `react-native-web` which translates to `<div>` and `<span>`

**You write ONCE, renders EVERYWHERE natively.**

---

## 2. Multiplatform Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  DEVELOPER WORKFLOW                                                │
│                                                                     │
│  1. Code in apps/mobile/ (React Native + Expo)                    │
│                     │                                               │
│                     ▼                                               │
│  2. npx expo export --platform web                                 │
│                     │                                               │
│                     ▼                                               │
│  3. apps/mobile/dist (static files)                               │
│                     │                                               │
│         ┌───────────┴───────────┐                                  │
│         ▼                       ▼                                  │
│  ┌──────────────┐      ┌───────────────┐                          │
│  │ Web Server   │      │ Desktop      │                          │
│  │ (Hono)      │      │ (Electron)   │                          │
│  │ Serves :3000│      │ Loads :3000   │                          │
│  └──────────────┘      └───────────────┘                          │
│                                                                     │
│  USER EXPERIENCE                                                   │
│                                                                     │
│  • Mobile: Native app (iOS/Android)                                │
│  • Web: Browser (Chrome/Safari/Firefox)                           │
│  • Desktop: Electron window                                        │
│                                                                     │
│  ALL THREE SEE EXACTLY THE SAME UI                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Monorepo Structure

```
omnicalc/
├── apps/
│   ├── mobile/                    # ⭐ SINGLE SOURCE OF TRUTH
│   │   ├── app/                   # Expo Router pages
│   │   │   ├── _layout.tsx       # Root layout with navigation
│   │   │   ├── index.tsx         # Calculator screen
│   │   │   └── login.tsx         # Auth screen
│   │   ├── lib/                  # Auth, API client
│   │   ├── stores/               # Zustand state
│   │   ├── components/           # Shared components
│   │   └── dist/                 # Web export (generated)
│   │
│   ├── web/                      # Static file server + API
│   │   └── src/
│   │       └── server/           # Hono API server
│   │           ├── serve.ts       # Static file server (serves mobile/dist)
│   │           ├── index.ts       # Hono app with API routes
│   │           ├── auth.ts        # Better Auth config
│   │           └── stripe.ts      # Stripe webhook handler
│   │
│   └── desktop/                   # Electron wrapper
│       └── main/
│           └── index.ts          # Loads http://localhost:3000
│
├── packages/
│   ├── ui/                       # Shared React Native components
│   │   └── src/
│   │       ├── Display.tsx        # Calculator display
│   │       ├── NumericKeypad.tsx # 0-9, decimal
│   │       ├── OperatorKeypad.tsx # +, -, ×, ÷, =
│   │       ├── ScientificKeypad.tsx
│   │       ├── HistoryPanel.tsx
│   │       └── ThemeProvider.tsx
│   │
│   ├── core-math/                # Pure math engine (no UI deps)
│   │   └── src/
│   │       ├── calculator.ts     # State machine
│   │       ├── operations.ts     # +, -, ×, ÷
│   │       ├── scientific.ts     # sin, cos, tan, log, etc.
│   │       └── parser.ts         # Expression evaluation
│   │
│   └── db/                       # Prisma schema + client
│       └── prisma/schema.prisma
│
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

---

## 4. Running the App

### Development Mode (All 3 Platforms)

```bash
# Terminal 1: Web server (serves mobile export on :3000)
cd apps/web/dist/server
node serve.js

# Terminal 2: Mobile dev server (hot reload on :8081)
cd apps/mobile
npx expo start --web

# Terminal 3: Desktop (loads localhost:3000)
cd apps/desktop
npx electron . --no-sandbox
```

### Production Build

```bash
# 1. Export mobile to web
cd apps/mobile
npx expo export --platform web

# 2. Build API server
cd apps/web
pnpm build:server

# 3. Build desktop
cd apps/desktop
pnpm build
```

---

## 5. Key Principles

### 5.1 Universal Primitives

```tsx
// This code runs NATIVELY on iOS, Android, AND renders to HTML on web

import { View, Text, Pressable } from 'react-native';

function CalculatorButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}
```

- **Mobile**: `Pressable` → Native touchable component
- **Web**: `Pressable` → `<button>` via react-native-web

### 5.2 Adaptive Design

```tsx
import { useWindowDimensions } from 'react-native';

function AppLayout({ children }) {
  const { width } = useWindowDimensions();

  // Desktop/web: show sidebar
  if (width >= 768) {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  // Mobile: show bottom tabs
  return <BottomTabLayout>{children}</BottomTabLayout>;
}
```

### 5.3 Platform-Specific Files

When you need different behavior per platform:

```
components/
├── BotonInstalar.tsx      # Shared logic
├── BotonInstalar.web.tsx   # Web/Desktop (hover effects, keyboard)
└── BotonInstalar.native.tsx # Mobile (haptic feedback)
```

---

## 6. Deployment

| Platform    | Source                  | Output       | Deployment      |
| ----------- | ----------------------- | ------------ | --------------- |
| **iOS**     | `apps/mobile`           | Native app   | Expo EAS        |
| **Android** | `apps/mobile`           | APK/AAB      | Expo EAS        |
| **Web**     | `apps/mobile` → `dist/` | Static files | Vercel/Netlify  |
| **Desktop** | `apps/mobile` → `dist/` | Electron     | GitHub Releases |

---

## 7. External Services

| Service     | Purpose                            |
| ----------- | ---------------------------------- |
| Neon        | PostgreSQL database                |
| Better Auth | Authentication                     |
| Stripe      | Web/Desktop payments               |
| RevenueCat  | Mobile payments (iOS/Android)      |
| Expo        | Mobile builds + push notifications |
| Sentry      | Error monitoring                   |

---

_Document version: 0.2.0 - Multiplatform architecture confirmed working_

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
