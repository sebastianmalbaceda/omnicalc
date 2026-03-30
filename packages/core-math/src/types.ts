/**
 * @omnicalc/core-math — Types
 *
 * Shared type definitions for the calculator engine.
 * All math operations use Decimal from decimal.js.
 */

import type Decimal from 'decimal.js';

export type Operator = '+' | '-' | '*' | '/' | '%' | '^';

export type ScientificFunction =
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
  | 'log'
  | 'ln'
  | 'sqrt'
  | 'square'
  | 'factorial'
  | 'reciprocal';

export type AngleUnit = 'degrees' | 'radians';

export interface CalculatorState {
  display: string;
  expression: string;
  previousValue: Decimal | null;
  currentValue: Decimal;
  operator: Operator | null;
  waitingForOperand: boolean;
  memory: Decimal;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculationResult {
  value: Decimal;
  display: string;
  expression: string;
}

export type CalculatorErrorCode =
  | 'DIVISION_BY_ZERO'
  | 'OVERFLOW'
  | 'DOMAIN_ERROR'
  | 'SYNTAX_ERROR'
  | 'UNKNOWN_ERROR';
