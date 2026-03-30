<p align="center">
  <img src="docs/assets/omnicalc-logo.svg" alt="OmniCalc Logo" width="80" height="80" />
</p>

<h1 align="center">OmniCalc</h1>

<p align="center">
  <strong>The only calculator you need — on every device.</strong>
</p>

<p align="center">
  A modern, multiplatform SaaS calculator with cloud sync, scientific mode, and precision math — built entirely in TypeScript.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="ROADMAP.md">Roadmap</a> •
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-Proprietary-red.svg" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6.svg?logo=typescript&logoColor=white" />
  <img alt="Expo" src="https://img.shields.io/badge/Expo-SDK_52-000020.svg?logo=expo&logoColor=white" />
  <img alt="Electron" src="https://img.shields.io/badge/Electron-v34-47848F.svg?logo=electron&logoColor=white" />
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
</p>

---

## Overview

**OmniCalc** is a professional-grade, multiplatform calculator application distributed as a SaaS product. It demonstrates senior-level software architecture: a TypeScript monorepo with shared business logic, universal UI, secure authentication, relational database modeling, and integrated payment processing across Web, iOS, Android, Windows, macOS, and Linux.

### Why OmniCalc?

- 🧮 **Precision Math** — Powered by `decimal.js` to eliminate floating-point errors
- ☁️ **Cloud Tape** — Synchronized calculation history across all devices (Pro)
- 🔬 **Scientific Mode** — Trigonometry, logarithms, roots, factorials, constants (Pro)
- 🎨 **Premium Design** — Glassmorphism aesthetic with editorial precision
- 📱 **Truly Multiplatform** — One codebase, six platforms

---

## Features

### Free Plan

- Basic arithmetic operations (+, −, ×, ÷, %, ±)
- Memory functions (M+, M−, MR, MC)
- Anonymous usage (no account required)
- System theme (light/dark)

### Pro Plan (Subscription)

- Scientific calculator (sin, cos, tan, log, ln, √, x², π, e)
- Cloud Tape — synced calculation history across all devices
- Premium themes and customization
- Ad-free experience

---

## Tech Stack

| Layer                 | Technology                    |
| --------------------- | ----------------------------- |
| **Language**          | TypeScript (strict mode)      |
| **Mobile + Web**      | Expo + Expo Router            |
| **Desktop**           | Electron + React              |
| **UI Framework**      | NativeWind + Gluestack UI     |
| **State Management**  | Zustand                       |
| **Data Fetching**     | TanStack Query                |
| **Backend (BFF)**     | Hono                          |
| **ORM**               | Prisma                        |
| **Database**          | PostgreSQL (Neon Serverless)  |
| **Authentication**    | Better Auth                   |
| **Payments (Web)**    | Stripe                        |
| **Payments (Mobile)** | RevenueCat                    |
| **Math Engine**       | decimal.js                    |
| **Monorepo**          | Turborepo                     |
| **Testing**           | Vitest + Playwright + Maestro |
| **Linting**           | ESLint + Prettier + Husky     |
| **CI/CD**             | GitHub Actions + Expo EAS     |
| **Hosting**           | Vercel + Railway              |
| **Monitoring**        | Sentry                        |

> For detailed architecture decisions, see [ARCHITECTURE.md](ARCHITECTURE.md) and [docs/adr/](docs/adr/).

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22 LTS
- **pnpm** ≥ 9 (package manager)
- **Git** ≥ 2.40

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/omnicalc.git
cd omnicalc

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development (all apps)
pnpm dev
```

### Platform-Specific Development

```bash
# Web only
pnpm dev:web

# iOS simulator
pnpm dev:ios

# Android emulator
pnpm dev:android

# Desktop (Electron)
pnpm dev:desktop
```

---

## Project Structure

```
omnicalc/
├── apps/
│   ├── web/                  # Hono BFF + Landing Page (Vercel)
│   ├── mobile/               # Expo (iOS + Android)
│   └── desktop/              # Electron + React
├── packages/
│   ├── ui/                   # NativeWind + Gluestack shared components
│   ├── core-math/            # Pure TypeScript math engine (decimal.js)
│   ├── db/                   # Prisma schema, migrations, client
│   └── tsconfig/             # Shared TypeScript configurations
├── docs/                     # Extended documentation
├── .agents/                  # AI agent skills
├── .github/                  # CI/CD workflows
├── SPEC.md                   # Functional requirements
├── ARCHITECTURE.md           # System architecture
├── ROADMAP.md                # Project milestones
├── PLANNING.md               # Current sprint tasks
└── turbo.json                # Turborepo configuration
```

---

## Documentation

| Document                           | Purpose                    |
| ---------------------------------- | -------------------------- |
| [SPEC.md](SPEC.md)                 | What the system must do    |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the system is built    |
| [ROADMAP.md](ROADMAP.md)           | Where the project is going |
| [PLANNING.md](PLANNING.md)         | What is being built now    |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute          |
| [CHANGELOG.md](CHANGELOG.md)       | Version history            |
| [SECURITY.md](SECURITY.md)         | Vulnerability reporting    |
| [AI_WORKFLOW.md](AI_WORKFLOW.md)   | AI development pipeline    |
| [docs/](docs/)                     | Extended technical docs    |

---

## License

Copyright © 2026 OmniCalc. All rights reserved. See [LICENSE](LICENSE).

---

<p align="center">
  Built with ❤️ and TypeScript
</p>
