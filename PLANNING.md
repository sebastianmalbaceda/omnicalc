# OmniCalc — Planning

> **Current Phase:** Phase 6 — Production Release
> **Sprint:** All core sprints complete
> **Last Updated:** 2026-04-13

---

## Sprint 0: Project Scaffolding ✅

### Completed

- [x] Project documentation analysis and review
- [x] Tech stack decisions finalized
- [x] README.md
- [x] SPEC.md
- [x] ARCHITECTURE.md
- [x] ROADMAP.md
- [x] PLANNING.md
- [x] CHANGELOG.md
- [x] CONTRIBUTING.md
- [x] LICENSE (Proprietary)
- [x] CODE_OF_CONDUCT.md
- [x] SECURITY.md
- [x] .gitignore
- [x] AGENTS.md
- [x] PROMPTS.md
- [x] .agentignore
- [x] AI_WORKFLOW.md
- [x] .env.example
- [x] Agent skills (.agents/skills/)
- [x] Extended documentation (docs/)
- [x] Architecture Decision Records (docs/adr/)

---

## Sprint 1: Math Engine Implementation ✅

### Completed

- [x] Initialize Turborepo with pnpm workspaces
- [x] Configure strict code quality (ESLint flat config, Prettier, Husky)
- [x] Create `packages/tsconfig/` (base, react, node)
- [x] Create `packages/core-math/` scaffolding (`decimal.js` + `vitest`)
- [x] Create `packages/db/` scaffolding (Prisma schema + Neon serverless)
- [x] Create `packages/ui/` scaffolding (NativeWind 4.1.0 + tailwind config)
- [x] Create `apps/` stubs (api/NestJS, mobile/Expo, desktop/Electron)
- [x] GitHub Actions CI workflow (`ci.yml`)
- [x] Implement basic operations (add, subtract, multiply, divide, modulo, negate)
- [x] Implement scientific functions (sin, cos, tan, log, root, factorial, etc.)
- [x] Implement robust parser (PEMDAS, parentheses)
- [x] Implement calculator state machine
- [x] **209 tests passing**

---

## Sprint 2: Shared UI Components ✅

### Completed

- [x] Button component (5 variants)
- [x] Display component
- [x] Numeric Keypad component
- [x] Operator Keypad component
- [x] Scientific Keypad component (Pro gated)
- [x] History Panel component (Cloud Tape)
- [x] Theme provider (light/dark/system)

---

## Sprint 3: Expo App + Zustand ✅

### Completed

- [x] Create `apps/mobile/` with Expo + Expo Router
- [x] Set up Zustand stores (`useCalculatorStore`)
- [x] Calculator screen (mobile portrait layout)
- [x] Login/Register screen
- [x] Auth client with token persistence (AsyncStorage)
- [x] Connect UI components to math engine via Zustand

---

## Sprint 4: SaaS Infrastructure ✅

### Completed

- [x] **Neon PostgreSQL** — Applied migration
  - Tables: users, sessions, accounts, verifications, calculations, user_settings
- [x] **Prisma Schema** — Full schema with Stripe/RevenueCat fields
- [x] **Better Auth** — Configured in NestJS (`apps/api/src/auth/`)
- [x] **NestJS API** — Full implementation with 4 modules:
  - Auth module (email/password, OAuth, session management)
  - Calculations module (CRUD with auth guards)
  - Users module (profile, settings management)
  - Billing module (Stripe checkout, portal, webhooks)
- [x] **Swagger docs** at `/api/docs`
- [x] **JWT Auth Guard** for protected routes
- [x] **Shared Types** — Zod schemas + TS types (`packages/shared-types/`)

---

## Sprint 5: Marketing + Web App ✅

### Completed

- [x] **`apps/marketing/`** — Next.js marketing site
  - Landing page (hero, features, platforms, CTA)
  - Pricing page (plan comparison)
  - Downloads page (all platforms)
  - Sign-in / Sign-up pages with OAuth
  - SEO-optimized metadata
- [x] **`apps/web/`** — Vite + React SPA (product)
  - Calculator interface
  - Auth integration
  - Cloud Tape history
  - Theme system

---

## Sprint 6: Desktop + Polish ✅

### Completed

- [x] **Electron** — Updated to load web SPA (`:3002`)
- [x] **Mobile auth** — Updated to call NestJS API (`:3001`)
- [x] **Documentation** — All docs updated (ARCHITECTURE, ROADMAP, SPEC, AGENTS, README)
- [x] **Obsolete code removed** — Hono server removed

---

## Project Status Summary

| Phase                           | Status      | Notes                         |
| ------------------------------- | ----------- | ----------------------------- |
| Phase 1: Math Engine            | ✅ Complete | 209 tests, decimal.js         |
| Phase 2: UI Components          | ✅ Complete | NativeWind + design tokens    |
| Phase 3: SaaS (DB + Auth + API) | ✅ Complete | NestJS + Better Auth + Prisma |
| Phase 4: Monetization           | ✅ Complete | Stripe fully configured       |
| Phase 5: Marketing + Web App    | ✅ Complete | Next.js + Vite SPA            |
| Phase 6: Desktop + Polish       | ✅ Complete | Electron + docs updated       |
| Phase 7: Production Release     | 🔄 Next     | Deployments, mobile builds    |

### Pending (requires user action)

- [ ] Configure real OAuth credentials (Google/GitHub)
- [ ] Configure real Stripe API keys
- [ ] Deploy NestJS API to Railway/Render
- [ ] Deploy Next.js marketing to Vercel
- [ ] Deploy Vite web app to Vercel/Netlify
- [ ] Configure custom domains + SSL
- [ ] EAS Build for mobile (iOS/Android)
- [ ] _[Post-MVP]_ Configure RevenueCat for mobile IAP
- [ ] _[Post-MVP]_ Set up Sentry for error monitoring
- [ ] _[Post-MVP]_ Set up Resend for transactional emails

### Verification

- ✅ Type-check: 11/11 packages passing
- ✅ Tests: 209 passing
- ✅ Lint: 0 errors
- ✅ Desktop build: Compiled successfully
- ✅ Web build: Compiled successfully
- ✅ Marketing build: Compiled successfully
