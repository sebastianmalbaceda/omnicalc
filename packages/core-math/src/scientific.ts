/**
 * @omnicalc/core-math — Scientific Functions
 *
 * Trigonometric, logarithmic, and advanced math (Pro features).
 * All functions use decimal.js — NEVER native JS Math.
 */

import Decimal from 'decimal.js';
import type { AngleUnit, ScientificFunction } from './types.js';
import { domainError } from './errors.js';
import { PI } from './constants.js';

function toRadians(degrees: Decimal): Decimal {
  return degrees.times(PI).dividedBy(180);
}

export function sin(value: Decimal, unit: AngleUnit = 'degrees'): Decimal {
  const rad = unit === 'degrees' ? toRadians(value) : value;
  return rad.sin();
}

export function cos(value: Decimal, unit: AngleUnit = 'degrees'): Decimal {
  const rad = unit === 'degrees' ? toRadians(value) : value;
  return rad.cos();
}

export function tan(value: Decimal, unit: AngleUnit = 'degrees'): Decimal {
  const rad = unit === 'degrees' ? toRadians(value) : value;
  return rad.tan();
}

export function asin(value: Decimal): Decimal {
  if (value.abs().greaterThan(1)) {
    throw domainError('asin');
  }
  return Decimal.asin(value);
}

export function acos(value: Decimal): Decimal {
  if (value.abs().greaterThan(1)) {
    throw domainError('acos');
  }
  return Decimal.acos(value);
}

export function atan(value: Decimal): Decimal {
  return Decimal.atan(value);
}

export function log(value: Decimal): Decimal {
  if (value.isNegative() || value.isZero()) {
    throw domainError('log');
  }
  return Decimal.log10(value);
}

export function ln(value: Decimal): Decimal {
  if (value.isNegative() || value.isZero()) {
    throw domainError('ln');
  }
  return value.ln();
}

export function sqrt(value: Decimal): Decimal {
  if (value.isNegative()) {
    throw domainError('sqrt');
  }
  return value.sqrt();
}

export function square(value: Decimal): Decimal {
  return value.times(value);
}

export function factorial(value: Decimal): Decimal {
  if (value.isNegative() || !value.isInteger()) {
    throw domainError('factorial');
  }
  if (value.isZero() || value.equals(1)) {
    return new Decimal(1);
  }
  let result = new Decimal(1);
  let i = new Decimal(2);
  while (i.lessThanOrEqualTo(value)) {
    result = result.times(i);
    i = i.plus(1);
  }
  return result;
}

export function reciprocal(value: Decimal): Decimal {
  if (value.isZero()) {
    throw domainError('reciprocal');
  }
  return new Decimal(1).dividedBy(value);
}

export function applyScientificFunction(
  fn: ScientificFunction,
  value: Decimal,
  unit: AngleUnit = 'degrees',
): Decimal {
  switch (fn) {
    case 'sin':
      return sin(value, unit);
    case 'cos':
      return cos(value, unit);
    case 'tan':
      return tan(value, unit);
    case 'asin':
      return asin(value);
    case 'acos':
      return acos(value);
    case 'atan':
      return atan(value);
    case 'log':
      return log(value);
    case 'ln':
      return ln(value);
    case 'sqrt':
      return sqrt(value);
    case 'square':
      return square(value);
    case 'factorial':
      return factorial(value);
    case 'reciprocal':
      return reciprocal(value);
  }
}
