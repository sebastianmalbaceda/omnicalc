# OmniCalc — Deployment Guide

> **Web (BFF):** Vercel
> **Mobile:** Expo EAS Build + App Store / Play Store
> **Desktop:** Electron Forge → GitHub Releases
> **Database:** Neon Serverless PostgreSQL

---

## Web Deployment (Vercel)

### Setup

1. Connect GitHub repo to Vercel
2. Set root directory to `apps/web`
3. Configure build command: `pnpm build --filter=@omnicalc/web`
4. Set output directory (framework auto-detected with Hono)

### Environment Variables

Set in Vercel dashboard:

- `DATABASE_URL` — Neon connection string
- `BETTER_AUTH_SECRET` — Min 32 chars, random
- `BETTER_AUTH_URL` — `https://api.omnicalc.app`
- `STRIPE_SECRET_KEY` — Production Stripe key
- `STRIPE_WEBHOOK_SECRET` — Production webhook secret
- `RESEND_API_KEY` — Email service key
- `SENTRY_DSN` — Error monitoring

### Preview Deployments

- Every PR gets a preview deployment
- Preview uses the same env vars (or override with Vercel env scoping)
- Database: use Neon branches for preview environments

---

## Mobile Deployment (Expo EAS)

### Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
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

### Build Tool: Electron Forge

```bash
cd apps/desktop

# Package for current OS
pnpm run package

# Build distributable
pnpm run make
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
2. Electron Forge uploads artifacts
3. Running app checks for updates on launch
4. User prompted to install update

### CI (GitHub Actions)

```yaml
# Build on every tag
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
      - run: pnpm --filter @omnicalc/desktop run make
      - uses: actions/upload-artifact@v4
        with:
          name: desktop-${{ matrix.os }}
          path: apps/desktop/out/make/**
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

- **Web:** `@sentry/node` in Hono middleware
- **Mobile:** `@sentry/react-native` in Expo
- **Desktop:** `@sentry/electron` in main process

### Source Maps

Upload source maps in CI:

```bash
sentry-cli releases files $VERSION upload-sourcemaps ./dist
```

---

_Document version: 0.1.0_
