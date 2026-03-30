# OmniCalc — Math Engine Specification

> **Package:** `packages/core-math`
> **Library:** `decimal.js`
> **Rule:** Zero native JS arithmetic. Zero side effects.

---

## Architecture

```
packages/core-math/
├── src/
│   ├── index.ts          # Public API exports
│   ├── calculator.ts     # Main engine class (state machine)
│   ├── operations.ts     # Basic arithmetic (+, -, ×, ÷, %)
│   ├── scientific.ts     # Scientific functions (sin, cos, log, etc.)
│   ├── parser.ts         # Expression parser (infix → evaluation)
│   ├── constants.ts      # Mathematical constants (π, e, φ)
│   ├── types.ts          # Shared types and interfaces
│   └── errors.ts         # Custom error types
└── __tests__/
    ├── operations.test.ts
    ├── scientific.test.ts
    ├── parser.test.ts
    └── calculator.test.ts
```

---

## Core Principle: decimal.js Everywhere

```typescript
// ❌ NEVER do this
const result = 0.1 + 0.2; // 0.30000000000000004

// ✅ ALWAYS do this
import Decimal from 'decimal.js';
const result = new Decimal('0.1').plus('0.2'); // 0.3
```

### Why decimal.js?

- Arbitrary precision arithmetic
- Handles numbers up to 9e+9000000000
- No floating-point errors
- Chainable API
- Well-maintained (1M+ weekly downloads)

---

## Public API

### Basic Operations

```typescript
// All inputs and outputs are strings to preserve precision
export function add(a: string, b: string): string;
export function subtract(a: string, b: string): string;
export function multiply(a: string, b: string): string;
export function divide(a: string, b: string): string;
export function modulo(a: string, b: string): string;
export function negate(a: string): string;
export function percentage(a: string): string;
```

### Scientific Functions

```typescript
export function sin(radians: string): string;
export function cos(radians: string): string;
export function tan(radians: string): string;
export function asin(value: string): string;
export function acos(value: string): string;
export function atan(value: string): string;
export function log(value: string): string; // log₁₀
export function ln(value: string): string; // logₑ
export function exp(value: string): string; // eˣ
export function pow(base: string, exp: string): string;
export function sqrt(value: string): string;
export function cbrt(value: string): string;
export function factorial(n: string): string;
export function abs(value: string): string;
```

### Constants

```typescript
export const PI: string; // 3.14159265358979...
export const E: string; // 2.71828182845904...
export const PHI: string; // 1.61803398874989... (Golden Ratio)
export const LN2: string; // 0.69314718055994...
export const LN10: string; // 2.30258509299404...
export const SQRT2: string; // 1.41421356237309...
```

---

## Error Handling

### Custom Error Types

```typescript
export class CalculatorError extends Error {
  constructor(
    message: string,
    public readonly code: CalculatorErrorCode,
  ) {
    super(message);
    this.name = 'CalculatorError';
  }
}

export enum CalculatorErrorCode {
  DIVISION_BY_ZERO = 'DIVISION_BY_ZERO',
  OVERFLOW = 'OVERFLOW',
  UNDERFLOW = 'UNDERFLOW',
  INVALID_INPUT = 'INVALID_INPUT',
  DOMAIN_ERROR = 'DOMAIN_ERROR', // e.g., sqrt(-1)
  SYNTAX_ERROR = 'SYNTAX_ERROR', // Malformed expression
}
```

### Error Conditions

| Operation            | Error Condition       | Error Code         |
| -------------------- | --------------------- | ------------------ |
| `divide(a, '0')`     | Division by zero      | `DIVISION_BY_ZERO` |
| Result > 9.999e+9999 | Overflow              | `OVERFLOW`         |
| `sqrt('-1')`         | Negative square root  | `DOMAIN_ERROR`     |
| `log('0')`           | Log of zero           | `DOMAIN_ERROR`     |
| `log('-5')`          | Log of negative       | `DOMAIN_ERROR`     |
| `factorial('-3')`    | Negative factorial    | `DOMAIN_ERROR`     |
| `factorial('3.5')`   | Non-integer factorial | `INVALID_INPUT`    |
| `parser('2 + + 3')`  | Malformed expression  | `SYNTAX_ERROR`     |

---

## Display Formatting

### Rules

1. **Standard notation:** For numbers with ≤ 15 digits
2. **Scientific notation:** For numbers with > 15 digits
3. **Trailing zeros:** Always trimmed (`3.0` → `3`, `1.500` → `1.5`)
4. **Thousands separator:** Optional, user-configurable (off by default)
5. **Negative display:** Standard minus sign (−), not hyphen-minus (-)
6. **Error display:** Short user-friendly message (e.g., "Cannot divide by zero")

### Precision Configuration

```typescript
// Default: 20 significant digits for internal calculations
Decimal.set({ precision: 20 });

// Display: max 15 digits shown to user
export const DISPLAY_PRECISION = 15;
```

---

## Calculator State Machine

```typescript
interface CalculatorState {
  display: string; // Current display value
  expression: string; // Full expression (for history)
  previousValue: string; // Left operand
  currentValue: string; // Right operand / input buffer
  operator: Operator | null; // Pending operator
  waitingForOperand: boolean;
  memory: string; // Memory register (M+, M-, MR)
  history: HistoryEntry[]; // Calculation history (local)
}

type Operator = '+' | '-' | '×' | '÷' | '%' | '^';

interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}
```

---

## Testing Requirements

### Coverage Target: 100%

Every function in `packages/core-math` must have tests for:

1. **Happy path** — Standard inputs
2. **Edge cases** — Zero, negative, very large, very small
3. **Precision** — Verify `0.1 + 0.2 === 0.3`
4. **Error conditions** — Each error code triggered
5. **Constants** — Verified to 15+ decimal places

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { add, divide } from '../src/operations';
import { CalculatorError, CalculatorErrorCode } from '../src/errors';

describe('operations', () => {
  it('should handle floating-point precision', () => {
    expect(add('0.1', '0.2')).toBe('0.3');
  });

  it('should throw on division by zero', () => {
    expect(() => divide('5', '0')).toThrow(CalculatorError);
    try {
      divide('5', '0');
    } catch (e) {
      expect((e as CalculatorError).code).toBe(CalculatorErrorCode.DIVISION_BY_ZERO);
    }
  });
});
```

---

_Document version: 0.1.0_
