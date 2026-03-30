# OmniCalc — Onboarding Guide

> Welcome to OmniCalc! This guide will get you up and running in 15 minutes.

---

## Prerequisites

Ensure you have these installed:

| Tool    | Version  | Check Command    |
| ------- | -------- | ---------------- |
| Node.js | ≥ 22 LTS | `node --version` |
| pnpm    | ≥ 9      | `pnpm --version` |
| Git     | ≥ 2.40   | `git --version`  |

### Install pnpm (if needed)

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

---

## Step 1: Clone & Install

```bash
git clone https://github.com/your-username/omnicalc.git
cd omnicalc
pnpm install
```

---

## Step 2: Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values. For local development, you need at minimum:

```
DATABASE_URL=<your-neon-connection-string>
BETTER_AUTH_SECRET=<random-string-32-chars-min>
```

### Getting a Neon Database

1. Sign up at [neon.tech](https://neon.tech) (free tier available)
2. Create a project named "omnicalc-dev"
3. Copy the connection string to `DATABASE_URL`

---

## Step 3: Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Open Prisma Studio to inspect
pnpm db:studio
```

---

## Step 4: Run Development Servers

```bash
# Run everything
pnpm dev

# Or run specific apps
pnpm dev:web       # Web/BFF at http://localhost:3001
pnpm dev:mobile    # Expo at http://localhost:8081
pnpm dev:desktop   # Electron app
```

---

## Step 5: Verify Setup

```bash
# Run all checks
pnpm lint          # Should pass with no errors
pnpm type-check    # Should pass with no errors
pnpm test          # All tests should pass
```

---

## Project Tour

### Where Things Live

| What          | Where                 | Notes                       |
| ------------- | --------------------- | --------------------------- |
| Math engine   | `packages/core-math/` | Pure TypeScript, decimal.js |
| UI components | `packages/ui/`        | NativeWind, cross-platform  |
| Database      | `packages/db/`        | Prisma schema & client      |
| API server    | `apps/web/`           | Hono BFF                    |
| Mobile app    | `apps/mobile/`        | Expo + Expo Router          |
| Desktop app   | `apps/desktop/`       | Electron + Vite             |

### Key Documentation

| Question              | Read                         |
| --------------------- | ---------------------------- |
| What does the app do? | `SPEC.md`                    |
| How is it built?      | `ARCHITECTURE.md`            |
| What's the plan?      | `ROADMAP.md` + `PLANNING.md` |
| How to style UI?      | `docs/design-system.md`      |
| How does math work?   | `docs/math-engine.md`        |
| How do payments work? | `docs/payments.md`           |
| How to contribute?    | `CONTRIBUTING.md`            |

---

## Common Tasks

### Adding a Math Function

1. Add function to `packages/core-math/src/operations.ts` (or `scientific.ts`)
2. Export from `packages/core-math/src/index.ts`
3. Write tests in `packages/core-math/__tests__/`
4. Run `pnpm test` to verify

### Creating a UI Component

1. Create `packages/ui/src/ComponentName/ComponentName.tsx`
2. Use NativeWind classes and design tokens
3. Export from `packages/ui/src/index.ts`
4. See `.agents/skills/create-component/SKILL.md` for template

### Adding an API Endpoint

1. Create route file in `apps/web/src/routes/`
2. Add Zod validation schema
3. Add auth middleware for protected routes
4. See `.agents/skills/create-api-endpoint/SKILL.md` for template

---

## Troubleshooting

### `pnpm install` fails

```bash
pnpm clean
rm -rf node_modules
pnpm install
```

### Database connection error

- Verify `DATABASE_URL` in `.env.local`
- Ensure Neon project is active (not suspended)
- Check SSL mode: `?sslmode=require`

### Type errors after pulling

```bash
pnpm db:generate    # Regenerate Prisma types
pnpm build          # Rebuild all packages
```

---

_Welcome aboard! 🚀_
