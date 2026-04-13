# OmniCalc — Deployment Guide

> **Marketing Site:** Vercel (Next.js)
> **Web App:** Vercel (Vite SPA)
> **API:** Railway/Render (NestJS)
> **Mobile:** Expo EAS Build + App Store / Play Store
> **Desktop:** Electron Builder → GitHub Releases
> **Database:** Neon Serverless PostgreSQL

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│  tudominio.com (Vercel — Next.js)                           │
│  Landing, Pricing, Downloads, Sign-in, Sign-up              │
└──────────────────────────────────────────────────────────────┘
                              │ Auth redirect
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  app.tudominio.com (Vercel — Vite SPA)                      │
│  Calculator product (browser)                               │
└──────────────────────────────────────────────────────────────┘
                              │ API calls
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  api.tudominio.com (Railway — NestJS :3001)                 │
│  Auth, Calculations, Users, Billing                         │
└──────────────────────────────────────────────────────────────┘
                              │ Prisma
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  Neon Serverless PostgreSQL                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Marketing Site Deployment (Vercel)

### Setup

1. Connect GitHub repo to Vercel
2. Set root directory to `apps/marketing`
3. Build command: `pnpm build --filter=@omnicalc/marketing`
4. Output directory: `.next` (auto-detected)

### Environment Variables

- `NEXT_PUBLIC_API_URL` — `https://api.tudominio.com`
- `NEXT_PUBLIC_WEB_APP_URL` — `https://app.tudominio.com`

### Custom Domain

- Add `tudominio.com` and `www.tudominio.com` in Vercel
- Configure DNS (A records + CNAME)

---

## Web App Deployment (Vercel)

### Setup

1. Create separate Vercel project for `apps/web`
2. Set root directory to `apps/web`
3. Build command: `pnpm build --filter=@omnicalc/web`
4. Output directory: `dist`

### Environment Variables

- `VITE_API_URL` — `https://api.tudominio.com`
- `VITE_WEB_MARKETING_URL` — `https://tudominio.com`

### Custom Domain

- Add `app.tudominio.com` in Vercel
- Configure DNS (CNAME)

---

## API Deployment (Railway/Render)

### Setup (Railway)

1. Connect GitHub repo
2. Set root directory to `apps/api`
3. Build command: `pnpm install && pnpm db:generate && pnpm --filter @omnicalc/api run build`
4. Start command: `pnpm --filter @omnicalc/api run start`

### Environment Variables

- `DATABASE_URL` — Neon production connection string
- `BETTER_AUTH_SECRET` — Min 32 chars, random
- `BETTER_AUTH_URL` — `https://api.tudominio.com`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `STRIPE_SECRET_KEY` — Production Stripe key
- `STRIPE_WEBHOOK_SECRET` — Production webhook secret
- `STRIPE_PRO_MONTHLY_PRICE_ID` — Stripe price ID
- `STRIPE_PRO_YEARLY_PRICE_ID` — Stripe price ID
- `WEB_MARKETING_URL` — `https://tudominio.com`
- `WEB_APP_URL` — `https://app.tudominio.com`
- `APP_URL` — `https://app.tudominio.com`

### Stripe Webhook Configuration

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://api.tudominio.com/api/payments/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Mobile Deployment (Expo EAS)

### Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
cd apps/mobile
eas build:configure
```

### Build Profiles (eas.json)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "...", "ascAppId": "..." },
      "android": { "serviceAccountKeyPath": "./play-store-key.json" }
    }
  }
}
```

### Build & Submit

```bash
# Development build (internal testing)
eas build --platform all --profile development

# Production build
eas build --platform all --profile production

# Submit to App Store / Play Store
eas submit --platform all --profile production
```

### OTA Updates

```bash
# Push JS-only updates without new binary
eas update --branch production --message "Fix display bug"
```

---

## Desktop Deployment (Electron)

### Build

```bash
cd apps/desktop

# Compile TypeScript
pnpm --filter @omnicalc/desktop run build

# Package with electron-builder
pnpm --filter @omnicalc/desktop exec electron-builder
```

### Platforms

| OS      | Output                  |
| ------- | ----------------------- |
| Windows | `.exe` (NSIS installer) |
| macOS   | `.dmg`                  |
| Linux   | `.AppImage`, `.deb`     |

### Auto-Update

Use `electron-updater` with GitHub Releases:

1. Tag a release on GitHub
2. Upload artifacts to release
3. Running app checks for updates on launch
4. User prompted to install update

### CI (GitHub Actions)

```yaml
on:
  push:
    tags: ['v*']

jobs:
  build-desktop:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm --filter @omnicalc/desktop run build
      - run: pnpm --filter @omnicalc/desktop exec electron-builder
      - uses: actions/upload-artifact@v4
        with:
          name: desktop-${{ matrix.os }}
          path: apps/desktop/dist/**
```

---

## Database (Neon)

### Branch Strategy

| Environment | Branch                | Usage               |
| ----------- | --------------------- | ------------------- |
| Production  | `main`                | Live database       |
| Staging     | `staging`             | Pre-release testing |
| Preview     | `preview/<pr-number>` | Per-PR branches     |
| Development | `dev`                 | Local development   |

### Migrations

```bash
# Apply migrations (development)
pnpm db:migrate

# Apply migrations (production — via CI)
pnpm --filter @omnicalc/db exec prisma migrate deploy
```

---

## Monitoring (Sentry)

- **API:** `@sentry/node` in NestJS interceptor
- **Web App:** `@sentry/react` in Vite app
- **Mobile:** `@sentry/react-native` in Expo
- **Desktop:** `@sentry/electron` in main process

### Source Maps

Upload source maps in CI:

```bash
sentry-cli releases files $VERSION upload-sourcemaps ./dist
```

---

_Document version: 1.0.0_
