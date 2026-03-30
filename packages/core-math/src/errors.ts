/**
 * @omnicalc/core-math — Errors
 *
 * Custom error types for calculator edge cases.
 */

import type { CalculatorErrorCode } from './types.js';

export class CalculatorError extends Error {
  public readonly code: CalculatorErrorCode;

  constructor(code: CalculatorErrorCode, message: string) {
    super(message);
    this.name = 'CalculatorError';
    this.code = code;
  }
}

export function divisionByZeroError(): CalculatorError {
  return new CalculatorError('DIVISION_BY_ZERO', 'Cannot divide by zero');
}

export function overflowError(): CalculatorError {
  return new CalculatorError('OVERFLOW', 'Result exceeds maximum precision');
}

export function domainError(fn: string): CalculatorError {
  return new CalculatorError('DOMAIN_ERROR', `Invalid input for ${fn}`);
}

export function syntaxError(detail: string): CalculatorError {
  return new CalculatorError('SYNTAX_ERROR', `Syntax error: ${detail}`);
}
