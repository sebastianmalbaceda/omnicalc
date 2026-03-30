# Contributing to OmniCalc

Thank you for your interest in contributing to OmniCalc! This document provides
guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable
behavior to the maintainers.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22 LTS
- **pnpm** ≥ 9
- **Git** ≥ 2.40

### Local Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/omnicalc.git
cd omnicalc

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run all checks
pnpm lint
pnpm test
pnpm type-check
```

---

## Development Workflow

### Branch Naming Convention

```
<type>/<short-description>

# Examples:
feature/scientific-calculator
fix/division-by-zero
chore/update-dependencies
docs/api-reference
refactor/calculator-store
```

### Workflow

1. Create a branch from `main`
2. Make focused changes (one feature/fix per PR)
3. Write or update tests
4. Ensure all checks pass locally
5. Push and open a Pull Request
6. Address review feedback
7. Squash-merge on approval

---

## Coding Standards

### TypeScript

- **Strict mode** — No `any` types, no `@ts-ignore`
- Use `interface` over `type` for object shapes
- Prefer `const` over `let`; never use `var`
- Use explicit return types on exported functions
- Prefer `async/await` over raw Promises or callbacks

### React / React Native

- Functional components only (no class components)
- Use named exports (no default exports)
- Components in `PascalCase` — one component per file
- Hooks start with `use` prefix
- All shared UI components live in `packages/ui/`

### Math Engine (`packages/core-math`)

- **Never** use native JS arithmetic operators (`+`, `-`, `*`, `/`) for float calculations
- Always use `decimal.js` for all mathematical operations
- All functions must be pure (no side effects)
- Every function must have corresponding unit tests

### Styling

- Use NativeWind (Tailwind CSS for React Native)
- Follow the design system in `docs/design-system.md`
- Design tokens must be used — no hardcoded colors or spacing values

### File Organization

```
# Shared components → packages/ui/
# Math logic       → packages/core-math/
# Database layer   → packages/db/
# Platform layouts → apps/<platform>/components/
# API routes       → apps/web/src/routes/
```

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                           |
| ---------- | ------------------------------------- |
| `feat`     | New feature                           |
| `fix`      | Bug fix                               |
| `docs`     | Documentation only                    |
| `style`    | Formatting, no logic change           |
| `refactor` | Code restructuring, no feature change |
| `test`     | Adding or updating tests              |
| `chore`    | Build process, CI, dependency updates |
| `perf`     | Performance improvement               |

### Scope (Optional)

Use the package or app name: `core-math`, `ui`, `db`, `web`, `mobile`, `desktop`

### Examples

```
feat(core-math): add trigonometric functions
fix(ui): correct display overflow for 16+ digits
docs: update API reference for calculations endpoint
test(core-math): add edge case tests for division by zero
chore: update Prisma to v6.5
```

---

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] New code has corresponding tests
- [ ] Documentation updated if needed (SPEC.md, API docs, etc.)
- [ ] No `console.log` left in production code
- [ ] No secrets or credentials committed

### PR Title Format

Follow the same format as commits:

```
feat(core-math): add logarithmic functions
```

### PR Description

Include:

- What changed and why
- How to test the change
- Screenshots (for UI changes)
- Breaking changes (if any)

### Review Policy

- At least 1 approval required
- CI must pass (lint + test + type-check)
- Squash-merge into `main`

---

## Testing Requirements

### Unit Tests (Vitest)

- Required for all `packages/core-math` functions
- Required for Zustand store logic
- Required for utility functions

### E2E Tests (Playwright — Web)

- Required for critical user flows (login, calculate, upgrade)
- Run against the web build

### E2E Tests (Maestro — Mobile)

- Required for critical mobile flows
- Run against iOS and Android simulators

### Coverage Targets

| Package              | Target |
| -------------------- | ------ |
| `packages/core-math` | 100%   |
| `packages/ui`        | 80%    |
| `packages/db`        | 80%    |
| `apps/*`             | 70%    |

---

## Questions?

If you have questions about contributing, please open a
[GitHub Discussion](https://github.com/your-username/omnicalc/discussions)
or reach out to the maintainers.

---

_Thank you for helping make OmniCalc better!_
