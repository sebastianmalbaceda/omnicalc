# OmniCalc — Roadmap

> **Version:** 0.1.0
> **Last Updated:** 2026-03-30

---

## Vision

Deliver a production-ready, multiplatform SaaS calculator that showcases senior-level TypeScript architecture — from monorepo structure to payment integration — across Web, iOS, Android, Windows, macOS, and Linux.

---

## Phase 1: Foundation — Math Engine & Monorepo

**Goal:** Establish the monorepo infrastructure and build the core math engine with 100% test coverage.

### Deliverables

- [ ] Turborepo monorepo with pnpm workspaces
- [ ] `packages/tsconfig` — shared TypeScript configurations
- [ ] `packages/core-math` — math engine with `decimal.js`
  - [ ] Basic operations (+, −, ×, ÷, %, ±)
  - [ ] Memory functions (M+, M−, MR, MC)
  - [ ] Expression parser
  - [ ] Error handling (division by zero, overflow, precision limits)
  - [ ] Scientific functions (sin, cos, tan, log, ln, √, x², n!, π, e)
- [ ] Vitest unit tests — 100% coverage on `core-math`
- [ ] ESLint + Prettier + Husky linting setup
- [ ] CI pipeline (GitHub Actions): lint + test on every PR

### Exit Criteria

- `pnpm test` passes with 100% coverage on `packages/core-math`
- `0.1 + 0.2 === 0.3` verified via decimal.js
- Division by zero returns structured error (no crash)

---

## Phase 2: Universal Interface

**Goal:** Build the shared UI components and connect them to the math engine via Zustand.

### Deliverables

- [ ] `packages/ui` — NativeWind + Gluestack shared components
  - [ ] Calculator Display component
  - [ ] Numeric Keypad component
  - [ ] Operator Keypad component
  - [ ] Scientific Keypad component (Pro)
  - [ ] History Panel component (Cloud Tape — Pro)
  - [ ] Theme system (light/dark/system)
- [ ] `apps/mobile` — Expo app with Expo Router
  - [ ] Calculator screen (portrait layout)
  - [ ] Responsive desktop/tablet layout
  - [ ] Zustand store integration (`useCalculatorStore`)
- [ ] Design system implementation (Editorial Precision glassmorphism)
- [ ] Visual testing on Web and iOS simulator

### Exit Criteria

- Calculator functional on web browser and iOS simulator simultaneously
- Glassmorphism design matches Stitch design reference
- Basic calculations work end-to-end through the UI

---

## Phase 3: SaaS Infrastructure

**Goal:** Implement the backend, database, authentication, and cloud sync.

### Deliverables

- [ ] `packages/db` — Prisma schema and Neon PostgreSQL
  - [ ] Users table (with Stripe fields)
  - [ ] Calculations table (Cloud Tape)
  - [ ] User Settings table
  - [ ] Initial migration
- [ ] `apps/web` — Hono BFF
  - [ ] Better Auth integration (email + Google + GitHub OAuth)
  - [ ] CRUD API for calculations
  - [ ] User settings API
  - [ ] Auth middleware and session management
  - [ ] Input validation with Zod
- [ ] Auth screens (Login, Register, Forgot Password)
- [ ] Cloud Tape sync (TanStack Query mutations with offline-first)
- [ ] Pro feature gating (server-side + client-side)
- [ ] `useAuthStore` Zustand store

### Exit Criteria

- User can register, login, and logout
- Pro calculations sync to Neon database and appear on Cloud Tape
- Free users cannot access scientific functions or history
- Offline calculations queue and sync on reconnection

---

## Phase 4: Monetization

**Goal:** Integrate payment processing for all platforms.

### Deliverables

- [ ] Stripe integration (Web/Desktop)
  - [ ] Checkout session creation
  - [ ] Customer Portal for subscription management
  - [ ] Webhook handler (payment success, subscription changes)
- [ ] RevenueCat integration (Mobile)
  - [ ] In-app purchase products configured
  - [ ] RevenueCat SDK in Expo
  - [ ] Webhook handler (purchase events)
- [ ] Centralized plan synchronization (`users.plan` field)
- [ ] Pricing page (Landing Page)
- [ ] Upgrade modal (in-app)

### Exit Criteria

- Web user can subscribe via Stripe → becomes Pro instantly
- Mobile user can subscribe via App Store/Play Store → becomes Pro
- Subscription status synchronized across all platforms
- Webhook idempotency verified

---

## Phase 5: Desktop, Landing Page & Launch

**Goal:** Package the desktop app, build the marketing landing page, and prepare for public launch.

### Deliverables

- [ ] `apps/desktop` — Electron app
  - [ ] Main/Renderer process setup
  - [ ] IPC bridge for native features
  - [ ] Auto-updater (Electron Updater)
  - [ ] Platform-specific builds (.exe, .dmg, .AppImage)
- [ ] Landing page (public marketing)
  - [ ] Hero section with CTA
  - [ ] Feature showcase
  - [ ] Pricing comparison (Free vs Pro)
  - [ ] Download section (platform detection)
- [ ] GitHub Actions for desktop releases
- [ ] Expo EAS build and submit pipeline
- [ ] Sentry error monitoring (all platforms)
- [ ] Final QA pass across all six platforms
- [ ] Public release (v1.0.0)

### Exit Criteria

- Desktop app installs and runs on Windows, macOS, Linux
- Landing page live at production URL
- All six platforms functional with payments
- Sentry capturing errors in production

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

_Document version: 0.1.0_
