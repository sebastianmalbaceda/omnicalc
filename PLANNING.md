# OmniCalc — Planning

> **Current Phase:** Phase 5 — Desktop + Launch ✅ COMPLETE
> **Sprint:** All sprints complete
> **Last Updated:** 2026-04-05

---

## Sprint 0: Project Scaffolding ✅

> [!NOTE]
> This sprint establishes the repository structure and all documentation
> before any code is written.

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

## Sprint 1: Math Engine Implementation (BUILD Phase) ✅

> [!IMPORTANT]  
> **Target Model:** MiniMax M2.7 / GLM 5.1 (BUILD)  
> **Status:** COMPLETE ✅
> The foundational infrastructure (monorepo, tsconfigs, package.json, Husky, CI) and the `core-math` stubs have been successfully created. The task now is to implement the functional code and achieve 100% test coverage.

### 1A: Infrastructure Scaffolding ✅

- [x] Initialize Turborepo with pnpm workspaces (`turbo.json`, `pnpm-workspace.yaml`)
- [x] Configure strict code quality (ESLint flat config, Prettier, Husky)
- [x] Create `packages/tsconfig/` (base, react, node)
- [x] Create `packages/core-math/` scaffolding (`decimal.js` + `vitest`)
- [x] Create `packages/db/` scaffolding (Prisma schema + Neon serverless)
- [x] Create `packages/ui/` scaffolding (NativeWind 4.1.0 + tailwind config)
- [x] Create `apps/` stubs (web/Hono, mobile/Expo, desktop/Electron)
- [x] GitHub Actions CI workflow (`ci.yml`)

### 1B: Core Math Implementation ✅

**Rules for `core-math`:**

- MUST use `decimal.js` for all arithmetic. NEVER use native JS `+`, `-`, `*`, `/`.
- Each function must have an accompanying Vitest unit test in `__tests__/`.

#### Mathematical Functions (`src/`)

- [x] Define `types.ts`, `errors.ts`, `constants.ts`
- [x] Implement basic operations in `operations.ts` (add, subtract, multiply, divide, modulo, negate)
- [x] Implement scientific functions in `scientific.ts` (sin, cos, tan, log, root, factorial, etc.)
- [x] Implement robust `parser.ts` (Expression evaluation supporting PEMDAS, parentheses)
- [x] Implement `calculator.ts` state machine (Handling state: display, current value, operator, history)

#### Unit Testing (`__tests__/`)

- [x] Test `operations.test.ts`
- [x] Test `scientific.test.ts` (Domain errors, accurate bounds)
- [x] Test `parser.test.ts`
- [x] Test `calculator.test.ts` (State machine transitions)
- [x] Run `pnpm test --filter=@omnicalc/core-math` - **205 tests passing**

**Test Results:**

- All 205 tests passing
- Lint passes
- Type-check passes
- Build compiles successfully

### Blocked

_None_

### Open Questions

_None_

---

## Sprint 2: Shared UI Components (BUILD Phase) ✅

> [!IMPORTANT]  
> **Target Model:** MiniMax M2.7 / GLM 5.1 (BUILD)  
> **Status:** COMPLETE ✅
> All shared UI components implemented with NativeWind + design tokens.

### Backlog

- [x] Create `packages/ui/` scaffolding (pre-existing)
- [x] Set up NativeWind + Gluestack UI (pre-existing)
- [x] Design tokens (colors, typography, spacing from DESIGN.md) - with dark mode
- [x] Button component
- [x] Display component
- [x] Numeric Keypad component
- [x] Operator Keypad component
- [x] Scientific Keypad component (Pro gated)
- [x] History Panel component (Cloud Tape)
- [x] Theme provider (light/dark/system)

### Completed

- `packages/ui/src/Button/` - Button with 5 variants (primary, secondary, operator, memory, function)
- `packages/ui/src/Display/` - Calculator display with expression and error states
- `packages/ui/src/Keypad/` - Numeric, Operator, and Scientific keypads
- `packages/ui/src/HistoryPanel/` - Cloud Tape history with Pro gate
- `packages/ui/src/ThemeProvider/` - Theme context with light/dark/system modes
- `packages/ui/tailwind.config.ts` - Design tokens with dark mode colors
- `packages/ui/src/global.d.ts` - NativeWind type declarations

### Status

_Sprint 2 complete - Sprint 3 ready_

---

## Sprint 3: Expo App + Zustand (BUILD Phase) ✅

> [!IMPORTANT]  
> **Target Model:** MiniMax M2.7 / GLM 5.1 (BUILD)  
> **Status:** COMPLETE ✅
> Expo Router layout, Zustand store, and calculator screen connecting UI to math engine.

### Backlog

- [x] Create `apps/mobile/` with Expo + Expo Router
- [x] Set up Zustand stores (`useCalculatorStore`)
- [x] Calculator screen (mobile portrait layout)
- [x] Connect UI components to math engine via Zustand
- [ ] Responsive desktop/tablet layout
- [ ] Visual testing on web and iOS simulator

### Completed

- `apps/mobile/app/_layout.tsx` - Root layout with ThemeProvider and SafeAreaView
- `apps/mobile/app/index.tsx` - Calculator screen with Display, NumericKeypad, OperatorKeypad, ScientificKeypad, HistoryPanel
- `apps/mobile/stores/useCalculatorStore.ts` - Zustand store wrapping core-math calculator engine
- `apps/mobile/global.d.ts` - NativeWind type declarations

### ITERATE Fixes (Bugs from Review)

- [x] Added `^` (power) to Operator type in core-math - `onPower` now works correctly
- [x] Added `power` function in operations.ts and `^` case in `applyOperator`
- [x] Percentage button correctly uses `percentage()` action (not modulo `%`)
- [x] Added working Theme Toggle button with `toggleTheme` function in ThemeProvider
- [x] Removed incorrect `pow` from ScientificFunction (power is a binary operator, not unary)

### Status

_Sprint 3 ITERATE complete - Ready for next sprint_

---

## Future Sprints

> See [ROADMAP.md](ROADMAP.md) for Phase 3–5 planning.

---

_This file is updated at the start of each development cycle._

---

## Phase 3: SaaS Infrastructure (BUILD Phase) ✅

> [!IMPORTANT]  
> **Status:** COMPLETE ✅
> Database, Auth, API routes, and Stripe integration configured.

### Completed

- [x] **Neon PostgreSQL** - Project created, migration applied
  - Project ID: `patient-firefly-03412078`
  - Tables: users, sessions, accounts, verifications, calculations, user_settings
- [x] **Prisma Schema** - Full schema with Stripe/RevenueCat fields
- [x] **Better Auth** - Configured in `apps/web/src/auth.ts`
- [x] **API Routes** - `/api/auth/**`, `/api/calculations`, `/api/settings`
- [x] **Stripe Integration** - Checkout, Customer Portal, Webhooks in `apps/web/src/stripe.ts`
- [x] **Auth Store** - `useAuthStore` in `apps/mobile/stores/`
- [x] **Environment** - `.env` file with Neon connection string

### Pending Configuration

- [x] OAuth credentials (Google/GitHub) - Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- [x] Stripe API keys - Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`
- [ ] _[POST-MVP]_ RevenueCat API key - Set `REVENUECAT_API_KEY`

---

## Phase 4: Monetization (BUILD Phase) ✅

> **Status:** COMPLETE ✅
> Stripe checkout implemented. RevenueCat deferred to post-MVP store launch.

### Completed

- [x] Create Stripe products and pricing (Pro plan)
- [x] Connect upgrade UI to payment flow
- [x] Webhook handlers for payment confirmation
- [~] _[POST-MVP]_ Configure RevenueCat in Expo for iOS/Android

---

## Phase 5: Desktop + Launch ✅ COMPLETE

> [!IMPORTANT]  
> **Status:** COMPLETE ✅
> All 3 platforms unified — mobile is the single source of truth.

### Completed

- [x] **Unified Server** - `apps/web/src/server/dev.ts` — serves mobile/dist SPA + API routes
- [x] **Electron Main Process** - `apps/desktop/main/index.ts` — loads http://localhost:3000
- [x] **Mobile Web Export** - `npx expo export --platform web` → `apps/mobile/dist/`
- [x] **Architecture Simplified** — removed duplicate React apps from web and desktop
- [x] **All Platforms Identical** — web, mobile, and desktop serve the same mobile UI

### Desktop App Structure

```
apps/desktop/
├── main/index.ts       # Electron main process (loads :3000)
└── dist/main/          # Compiled output (generated)
```

### To Run

```bash
# Terminal 1: Unified server (mobile SPA + API)
pnpm dev:web

# Terminal 2: Mobile dev (Expo with HMR)
pnpm dev:mobile

# Terminal 3: Desktop (Electron shell)
pnpm dev:desktop
```

---

## Project Status Summary

| Phase                      | Status      | Notes                    |
| -------------------------- | ----------- | ------------------------ |
| Phase 1: Math Engine       | ✅ Complete | 209 tests, decimal.js    |
| Phase 2: UI Components     | ✅ Complete | NativeWind + Gluestack   |
| Phase 3: SaaS (DB + Auth)  | ✅ Complete | Neon + Better Auth       |
| Phase 4: Monetization      | ✅ Complete | Stripe fully configured. |
| Phase 5: Desktop + Landing | ✅ Complete | Electron + landing page  |

### Pending (requires user action)

- [x] Configure real OAuth credentials (Google/GitHub)
- [x] Configure real Stripe API keys
- [ ] _[Post-MVP]_ Configure RevenueCat for mobile IAP
- [ ] _[Post-MVP]_ Set up Sentry for error monitoring
- [ ] _[Post-MVP]_ Set up Resend for transactional emails

### Verification

- ✅ Type-check: 7 packages passing
- ✅ Tests: 209 passing
- ✅ Desktop build: Main + Renderer compiled successfully
