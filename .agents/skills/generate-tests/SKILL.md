---
name: generate-tests
description: |
  Trigger when: creating or modifying functions in packages/core-math,
  creating Zustand stores, or when any task involves writing unit tests.
  Do NOT trigger for: E2E tests (use Playwright/Maestro directly),
  documentation changes, or styling-only updates.
---

# Generate Tests — OmniCalc

## Framework & Configuration

- **Test runner:** Vitest 3
- **Location:** `__tests__/` directory adjacent to source
- **Config:** `vitest.config.ts` at package root
- **Assertion style:** `expect` from Vitest (Jest-compatible API)

## File Naming

```
src/calculator.ts     → __tests__/calculator.test.ts
src/operations.ts     → __tests__/operations.test.ts
src/scientific.ts     → __tests__/scientific.test.ts
```

## Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide } from '../src/operations';

describe('operations', () => {
  describe('add', () => {
    it('should add two positive integers', () => {
      expect(add('2', '3')).toBe('5');
    });

    it('should handle floating-point precision (0.1 + 0.2)', () => {
      expect(add('0.1', '0.2')).toBe('0.3');
    });

    it('should handle negative numbers', () => {
      expect(add('-5', '3')).toBe('-2');
    });
  });

  describe('divide', () => {
    it('should throw CalculatorError on division by zero', () => {
      expect(() => divide('5', '0')).toThrow('Division by zero');
    });
  });
});
```

## Coverage Requirements

| Package              | Target |
| -------------------- | ------ |
| `packages/core-math` | 100%   |
| `packages/ui`        | 80%    |
| `packages/db`        | 80%    |
| `apps/*`             | 70%    |

## Checklist

For every test file, verify:

- [ ] Happy path covered
- [ ] Edge cases covered (zero, negative, very large numbers, empty input)
- [ ] Error conditions tested (throws expected errors)
- [ ] Precision tested (decimal.js correctness)
- [ ] No native JS arithmetic in assertions
- [ ] Descriptive test names (reads like documentation)

## Running Tests

```bash
# All tests
pnpm test

# Specific package
pnpm --filter @omnicalc/core-math test

# Watch mode
pnpm --filter @omnicalc/core-math test -- --watch

# Coverage report
pnpm --filter @omnicalc/core-math test -- --coverage
```
