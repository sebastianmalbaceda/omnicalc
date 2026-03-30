/**
 * @omnicalc/core-math — Basic Operations
 *
 * Pure arithmetic functions using decimal.js.
 * NEVER use native JS operators (+, -, *, /) for calculations.
 */

import Decimal from 'decimal.js';
import type { Operator } from './types.js';
import { divisionByZeroError } from './errors.js';

export function add(a: Decimal, b: Decimal): Decimal {
  return a.plus(b);
}

export function subtract(a: Decimal, b: Decimal): Decimal {
  return a.minus(b);
}

export function multiply(a: Decimal, b: Decimal): Decimal {
  return a.times(b);
}

export function divide(a: Decimal, b: Decimal): Decimal {
  if (b.isZero()) {
    throw divisionByZeroError();
  }
  return a.dividedBy(b);
}

export function modulo(a: Decimal, b: Decimal): Decimal {
  if (b.isZero()) {
    throw divisionByZeroError();
  }
  return a.modulo(b);
}

export function power(a: Decimal, b: Decimal): Decimal {
  return a.pow(b);
}

export function negate(value: Decimal): Decimal {
  return value.negated();
}

export function percentage(value: Decimal): Decimal {
  return value.dividedBy(100);
}

export function applyOperator(a: Decimal, operator: Operator, b: Decimal): Decimal {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    case '%':
      return modulo(a, b);
    case '^':
      return power(a, b);
  }
}
