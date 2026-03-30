/**
 * @omnicalc/core-math
 *
 * Public API for the OmniCalc math engine.
 * All calculations MUST use this package — never native JS arithmetic.
 */

export {
  createCalculatorState,
  inputDigit,
  inputOperator,
  calculate,
  calculateExpression,
  clear,
  clearEntry,
  toggleSign,
  memoryAdd,
  memorySubtract,
  memoryRecall,
  memoryClear,
  applyMemoryOperation,
  scientificOperation,
  inputParenthesis,
  backspace,
  clearHistory,
  getDisplay,
  getExpression,
} from './calculator.js';
export { percentage as percentageState } from './calculator.js';
export {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  negate,
  percentage,
  applyOperator,
} from './operations.js';
export {
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  log,
  ln,
  sqrt,
  square,
  factorial,
  reciprocal,
  applyScientificFunction,
} from './scientific.js';
export { parseNumber, formatDisplay, evaluateExpression } from './parser.js';
export { PI, E, LN2, LN10, SQRT2, MAX_DISPLAY_DIGITS } from './constants.js';
export { CalculatorError } from './errors.js';
export type {
  Operator,
  ScientificFunction,
  AngleUnit,
  CalculatorState,
  HistoryEntry,
  CalculationResult,
  CalculatorErrorCode,
} from './types.js';
