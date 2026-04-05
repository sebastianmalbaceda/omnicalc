# OmniCalc — Roadmap

> **Version:** 0.2.0
> **Last Updated:** 2026-04-05

---

## Vision

Deliver a production-ready, multiplatform SaaS calculator that showcases senior-level TypeScript architecture — from monorepo structure to payment integration — across Web, iOS, Android, Windows, macOS, and Linux.

---

## Phase 1: Foundation — Math Engine & Monorepo ✅ COMPLETE

**Goal:** establish the monorepo infrastructure and build the core math engine with 100% test coverage.

### Deliverables

- [x] Turborepo monorepo with pnpm workspaces
- [x] `packages/tsconfig` — shared TypeScript configurations
- [x] `packages/core-math` — math engine with `decimal.js`
  - [x] Basic operations (+, −, ×, ÷, %, ±)
  - [x] Memory functions (M+, M−, MR, MC)
  - [x] Expression parser
  - [x] Error handling (division by zero, overflow, precision limits)
  - [x] Scientific functions (sin, cos, tan, log, ln, √, x², n!, π, e)
- [x] Vitest unit tests — 100% coverage on `core-math`
- [x] ESLint + Prettier + Husky linting setup
- [x] CI pipeline (GitHub Actions): lint + test on every PR

---

## Phase 2: Universal Interface ✅ COMPLETE

**Goal:** Build the shared UI components and connect them to the math engine via Zustand.

### Deliverables

- [x] `packages/ui` — NativeWind shared components
  - [x] Calculator Display component
  - [x] Numeric Keypad component
  - [x] Operator Keypad component
  - [x] Scientific Keypad component (Pro)
  - [x] History Panel component (Cloud Tape — Pro)
  - [x] Theme system (light/dark/system)
- [x] `apps/mobile` — Expo app with Expo Router
  - [x] Calculator screen
  - [x] Login screen
  - [x] Zustand store integration (`useCalculatorStore`, `useAuthStore`)
- [x] Design system implementation (Ethereal Logic)
- [x] React Native Web export working

---

## Phase 3: SaaS Infrastructure ✅ COMPLETE

**Goal:** Implement the backend, database, authentication, and cloud sync.

### Deliverables

- [x] `packages/db` — Prisma schema and Neon PostgreSQL
  - [x] Users table (with Stripe fields)
  - [x] Calculations table (Cloud Tape)
  - [x] User Settings table
  - [x] Initial migration
- [x] `apps/web` — Hono unified server
  - [x] Better Auth integration (email + Google + GitHub OAuth)
  - [x] CRUD API for calculations
  - [x] User settings API
  - [x] Auth middleware and session management
  - [x] Input validation with Zod
- [x] Auth screens (Login, Register)
- [x] Cloud Tape sync
- [x] Pro feature gating
- [x] `useAuthStore` Zustand store

---

## Phase 4: Monetization ✅ COMPLETE

**Goal:** Integrate payment processing for all platforms.

### Deliverables

- [x] Stripe integration (Web/Desktop)
  - [x] Checkout session creation
  - [x] Customer Portal for subscription management
  - [x] Webhook handler (payment success, subscription changes)
- [x] RevenueCat integration (Mobile) — configured, ready for App Store products
- [x] Centralized plan synchronization (`users.plan` field)
- [x] Pro upgrade flow in-app

---

## Phase 5: Desktop, Launch ✅ COMPLETE

**Goal:** Package the desktop app and unify all platforms.

### Deliverables

- [x] `apps/desktop` — Electron app (thin shell loading unified server)
- [x] Unified architecture: mobile → web export → Hono server → Electron
- [x] All 3 platforms share identical UI from `apps/mobile/`
- [x] Architecture documentation updated

### Exit Criteria

- [x] Desktop app loads from unified server
- [x] All three platforms functional with identical UI
- [x] Architecture documented and verified

---

## Next Steps (Post-merge)

- [ ] RevenueCat products configured in App Store Connect / Google Play
- [ ] Sentry error monitoring integration
- [ ] Resend transactional emails
- [ ] Final QA pass across all platforms
- [ ] Public release (v1.0.0)

---

## Future Considerations (Post v1.0)

- 🌍 Internationalization (i18n) — multi-language support
- 📊 Graphing calculator mode
- 💱 Currency and unit conversion
- 🤖 AI-powered math assistant
- 📋 Calculation sharing (public links)
- ⌨️ Keyboard shortcuts (desktop)
- 🔌 Plugin/extension system

---

_Document version: 0.2.0 — All 5 phases complete_
