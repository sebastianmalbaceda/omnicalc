# OmniCalc — Testing Strategy

> **Unit tests:** Vitest 3
> **Web E2E:** Playwright
> **Mobile E2E:** Maestro
> **Coverage tool:** Vitest built-in (v8 provider)

---

## Test Structure

```
packages/core-math/
├── src/
│   └── operations.ts
└── __tests__/
    └── operations.test.ts    ← Vitest unit tests

apps/web/
├── src/
└── e2e/
    └── calculator.spec.ts    ← Playwright E2E

apps/mobile/
└── .maestro/
    └── calculator-flow.yaml  ← Maestro mobile E2E
```

---

## Coverage Targets

| Package              | Target   | Rationale                              |
| -------------------- | -------- | -------------------------------------- |
| `packages/core-math` | **100%** | Critical math engine — no gaps allowed |
| `packages/ui`        | 80%      | Shared components across all platforms |
| `packages/db`        | 80%      | Data access layer                      |
| `apps/*`             | 70%      | Platform-specific integration code     |

---

## Unit Tests (Vitest)

### Configuration

```typescript
// vitest.config.ts (at package root)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // 'jsdom' for UI packages
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
```

### Running

```bash
pnpm test                          # All tests
pnpm --filter @omnicalc/core-math test   # Single package
pnpm test -- --watch               # Watch mode
pnpm test -- --coverage            # With coverage
```

### Test Categories

1. **Happy path** — Standard inputs produce expected outputs
2. **Edge cases** — Zero, negative, very large numbers, empty strings
3. **Precision** — Verify decimal.js correctness (0.1 + 0.2 = 0.3)
4. **Error conditions** — Each CalculatorErrorCode triggered
5. **State transitions** — Calculator state machine behaves correctly

---

## E2E Tests — Playwright (Web)

### Setup

```bash
pnpm --filter @omnicalc/web exec playwright install
```

### Test Structure

```typescript
// apps/web/e2e/calculator.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform basic addition', async ({ page }) => {
    await page.click('[data-testid="key-2"]');
    await page.click('[data-testid="key-plus"]');
    await page.click('[data-testid="key-3"]');
    await page.click('[data-testid="key-equals"]');
    await expect(page.locator('[data-testid="display"]')).toHaveText('5');
  });

  test('should handle division by zero', async ({ page }) => {
    await page.click('[data-testid="key-5"]');
    await page.click('[data-testid="key-divide"]');
    await page.click('[data-testid="key-0"]');
    await page.click('[data-testid="key-equals"]');
    await expect(page.locator('[data-testid="display"]')).toContainText('Cannot divide by zero');
  });
});
```

### Running

```bash
pnpm test:e2e                      # All E2E tests
pnpm test:e2e -- --headed          # With browser visible
pnpm test:e2e -- --project=chromium # Specific browser
```

---

## E2E Tests — Maestro (Mobile)

### Flow File

```yaml
# apps/mobile/.maestro/calculator-flow.yaml
appId: app.omnicalc.mobile
---
- tapOn: '2'
- tapOn: '+'
- tapOn: '3'
- tapOn: '='
- assertVisible: '5'
```

### Running

```bash
maestro test apps/mobile/.maestro/calculator-flow.yaml
```

---

## CI Integration

```yaml
# .github/workflows/ci.yml — test job
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 22
        cache: pnpm
    - run: pnpm install --frozen-lockfile
    - run: pnpm lint
    - run: pnpm type-check
    - run: pnpm test -- --coverage
    - run: pnpm test:e2e
```

---

_Document version: 0.1.0_
