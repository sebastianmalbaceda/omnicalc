# OmniCalc — Roadmap

> **Version:** 1.0.0
> **Last Updated:** 2026-04-13

---

## Vision

Deliver a production-ready, multiplatform SaaS calculator with a professional 2026 TypeScript architecture — NestJS API, Next.js marketing, Vite web app, Expo mobile, and Electron desktop — all sharing a single codebase.

---

## Phase 1: Foundation — Math Engine & Monorepo ✅ COMPLETE

- [x] Turborepo monorepo with pnpm workspaces
- [x] `packages/tsconfig` — shared TypeScript configurations
- [x] `packages/core-math` — math engine with `decimal.js`
  - [x] Basic operations (+, −, ×, ÷, %)
  - [x] Memory functions (M+, M−, MR, MC)
  - [x] Expression parser
  - [x] Error handling (division by zero, overflow, precision limits)
  - [x] Scientific functions (sin, cos, tan, log, ln, √, x², n!, π, e)
- [x] Vitest unit tests — 100% coverage on `core-math`
- [x] ESLint + Prettier + Husky linting setup
- [x] CI pipeline (GitHub Actions): lint + type-check + test on every PR

---

## Phase 2: Universal Interface ✅ COMPLETE

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
  - [x] Token-based auth with AsyncStorage persistence
- [x] Design system implementation (Ethereal Logic)
- [x] React Native Web export working

---

## Phase 3: SaaS Infrastructure ✅ COMPLETE

- [x] `packages/db` — Prisma schema and Neon PostgreSQL
  - [x] Users table (with Stripe fields)
  - [x] Calculations table (Cloud Tape)
  - [x] User Settings table
  - [x] Better Auth tables (sessions, accounts, verifications)
  - [x] Initial migration
- [x] `packages/shared-types` — Zod schemas + TS types (frontend ↔ backend contract)
- [x] `apps/api` — NestJS central API server
  - [x] Auth module (Better Auth integration, email/password, OAuth)
  - [x] Calculations module (CRUD with auth guards)
  - [x] Users module (profile, settings management)
  - [x] Billing module (Stripe checkout, portal, webhooks)
  - [x] Swagger docs at `/api/docs`
  - [x] JWT auth guard for protected routes
- [x] `apps/marketing` — Next.js marketing site
  - [x] Landing page with hero, features, platforms, CTA
  - [x] Pricing page with plan comparison
  - [x] Downloads page for all platforms
  - [x] Sign-in / Sign-up pages with OAuth
  - [x] SEO-optimized metadata
- [x] `apps/web` — Vite + React SPA (product)
  - [x] Calculator interface
  - [x] Auth integration
  - [x] Cloud Tape history
  - [x] Theme system

---

## Phase 4: Monetization ✅ COMPLETE

- [x] Stripe integration (Web/Desktop)
  - [x] Checkout session creation (monthly + yearly)
  - [x] Customer Portal for subscription management
  - [x] Webhook handler (payment success, subscription changes)
  - [x] Two price tiers: $4.99/month, $39.99/year
- [ ] RevenueCat integration (Mobile) — deferred, planned for App Store/Play Store release
- [x] Centralized plan synchronization (`users.plan` field)
- [x] Pro upgrade flow in-app

---

## Phase 5: Desktop, Launch ✅ COMPLETE

- [x] `apps/desktop` — Electron app (loads web SPA)
- [x] All platforms share identical UI from `apps/mobile/`
- [x] Architecture documentation updated
- [x] Session persistence across platforms
- [x] Auth flow working end-to-end (register, login, session persistence)

---

## Phase 6: Production Release (Next)

### Mobile Builds

- [ ] EAS Build configuration (`eas.json`)
- [ ] Android APK/AAB build
- [ ] iOS IPA build
- [ ] App Store Connect setup
- [ ] Google Play Console setup

### Production Infrastructure

- [ ] Deploy NestJS API to Railway/Render
- [ ] Deploy Next.js marketing to Vercel
- [ ] Deploy Vite web app to Vercel/Netlify
- [ ] Configure custom domains + SSL
  - `tudominio.com` → Marketing
  - `app.tudominio.com` → Web App
  - `api.tudominio.com` → API
- [ ] Set up production Neon database branch
- [ ] Configure Stripe production keys + webhooks
- [ ] Set up CI/CD for automated deployments

### Deferred Services (Planned)

- [ ] **RevenueCat** — Mobile payments for App Store/Google Play
- [ ] **Resend** — Transactional emails (welcome, password reset, receipts)
- [ ] **Sentry** — Error monitoring and crash reporting

### Final QA

- [ ] Cross-platform testing (Web, iOS, Android, Windows, macOS, Linux)
- [ ] Payment flow end-to-end (checkout → webhook → plan upgrade)
- [ ] Auth flow with OAuth (Google, GitHub)
- [ ] Session persistence across all platforms
- [ ] Performance audit (Lighthouse, React Profiler)
- [ ] Public release (v1.0.0)

---

## Future Considerations (Post v1.0)

- 🌍 Internationalization (i18n) — multi-language support
- 📊 Graphing calculator mode
- 💱 Currency and unit conversion
- 🤖 AI-powered math assistant
- 📋 Calculation sharing (public links)
- ⌨️ Keyboard shortcuts (desktop/web)
- 🔌 Plugin/extension system
- 👥 Team/organization plans

---

_Document version: 1.0.0 — Production-Ready Multiplatform SaaS Architecture_
