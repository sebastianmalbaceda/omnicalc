/**
 * @omnicalc/core-math — Calculator Engine
 *
 * State machine for calculator operations with memory, history,
 * and full expression evaluation support.
 */

import Decimal from 'decimal.js';
import type {
  Operator,
  ScientificFunction,
  AngleUnit,
  CalculatorState,
  HistoryEntry,
} from './types.js';
import { applyOperator } from './operations.js';
import { applyScientificFunction } from './scientific.js';
import { evaluateExpression } from './parser.js';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

const MAX_DISPLAY_DIGITS = 16;

export interface CalculatorConfig {
  maxDigits?: number;
  angleUnit?: AngleUnit;
}

export function createCalculatorState(_config?: CalculatorConfig): CalculatorState {
  return {
    display: '0',
    expression: '',
    previousValue: null,
    currentValue: new Decimal(0),
    operator: null,
    waitingForOperand: false,
    memory: new Decimal(0),
    history: [],
  };
}

function formatResult(value: Decimal, maxDigits: number = MAX_DISPLAY_DIGITS): string {
  const absValue = value.abs();

  if (
    absValue.greaterThan(new Decimal(10).pow(maxDigits - 1)) ||
    (absValue.isPositive() && absValue.lessThan(new Decimal(10).pow(-(maxDigits - 2))))
  ) {
    return value.toExponential(maxDigits - 3);
  }

  const str = value.toString();
  if (str.replace(/[-.]/, '').length > maxDigits) {
    return value.toExponential(maxDigits - 3);
  }

  return str;
}

export function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.waitingForOperand) {
    return {
      ...state,
      display: digit,
      waitingForOperand: false,
    };
  }

  if (state.display === '0' && digit !== '.') {
    return {
      ...state,
      display: digit,
    };
  }

  if (state.display.replace(/[-.]/, '').length >= MAX_DISPLAY_DIGITS) {
    return state;
  }

  if (digit === '.' && state.display.includes('.')) {
    return state;
  }

  return {
    ...state,
    display: state.display + digit,
  };
}

export function inputOperator(state: CalculatorState, op: Operator): CalculatorState {
  const currentValue = new Decimal(state.display);

  if (state.operator && state.waitingForOperand) {
    return {
      ...state,
      operator: op,
      expression: `${state.previousValue!.toString()} ${op} ${currentValue.toString()}`,
    };
  }

  if (state.previousValue === null) {
    return {
      ...state,
      previousValue: currentValue,
      operator: op,
      expression: `${currentValue.toString()} ${op}`,
      waitingForOperand: true,
    };
  }

  try {
    const result = applyOperator(state.previousValue, state.operator!, currentValue);
    const newExpression = `${result.toString()} ${op}`;

    return {
      ...state,
      display: formatResult(result),
      previousValue: result,
      operator: op,
      expression: newExpression,
      waitingForOperand: true,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'CalculatorError') {
      return {
        ...state,
        display: 'Error',
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        expression: '',
      };
    }
    throw error;
  }
}

export function calculate(state: CalculatorState): CalculatorState {
  if (state.operator === null || state.previousValue === null) {
    return state;
  }

  const currentValue = new Decimal(state.display);

  try {
    const result = applyOperator(state.previousValue, state.operator, currentValue);
    const fullExpression = `${state.previousValue.toString()} ${state.operator} ${currentValue.toString()}`;

    const historyEntry: HistoryEntry = {
      expression: fullExpression,
      result: formatResult(result),
      timestamp: Date.now(),
    };

    return {
      ...state,
      display: formatResult(result),
      previousValue: null,
      operator: null,
      waitingForOperand: true,
      expression: '',
      history: [historyEntry, ...state.history].slice(0, 100),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'CalculatorError') {
      return {
        ...state,
        display: 'Error',
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        expression: '',
      };
    }
    throw error;
  }
}

export function calculateExpression(state: CalculatorState, expression: string): CalculatorState {
  try {
    const result = evaluateExpression(expression);
    const historyEntry: HistoryEntry = {
      expression,
      result: formatResult(result),
      timestamp: Date.now(),
    };

    return {
      ...state,
      display: formatResult(result),
      previousValue: null,
      operator: null,
      waitingForOperand: true,
      expression: '',
      history: [historyEntry, ...state.history].slice(0, 100),
    };
  } catch {
    return {
      ...state,
      display: 'Error',
      previousValue: null,
      operator: null,
      waitingForOperand: true,
      expression: '',
    };
  }
}

export function clear(state: CalculatorState): CalculatorState {
  return {
    ...state,
    display: '0',
    expression: '',
    previousValue: null,
    operator: null,
    waitingForOperand: false,
  };
}

export function clearEntry(state: CalculatorState): CalculatorState {
  return {
    ...state,
    display: '0',
  };
}

export function toggleSign(state: CalculatorState): CalculatorState {
  if (state.display === '0' || state.display === 'Error') {
    return state;
  }

  if (state.display.startsWith('-')) {
    return {
      ...state,
      display: state.display.slice(1),
    };
  }

  return {
    ...state,
    display: '-' + state.display,
  };
}

export function percentage(state: CalculatorState): CalculatorState {
  const currentValue = new Decimal(state.display);
  const result = currentValue.dividedBy(100);

  return {
    ...state,
    display: formatResult(result),
    waitingForOperand: true,
  };
}

export function memoryAdd(state: CalculatorState): CalculatorState {
  const currentValue = new Decimal(state.display);
  return {
    ...state,
    memory: state.memory.plus(currentValue),
    waitingForOperand: true,
  };
}

export function memorySubtract(state: CalculatorState): CalculatorState {
  const currentValue = new Decimal(state.display);
  return {
    ...state,
    memory: state.memory.minus(currentValue),
  };
}

export function memoryRecall(state: CalculatorState): CalculatorState {
  if (state.waitingForOperand) {
    return {
      ...state,
      display: formatResult(state.memory),
    };
  }

  return {
    ...state,
    display: formatResult(state.memory),
    waitingForOperand: true,
  };
}

export function memoryClear(state: CalculatorState): CalculatorState {
  return {
    ...state,
    memory: new Decimal(0),
  };
}

export function applyMemoryOperation(
  state: CalculatorState,
  operation: 'M+' | 'M-' | 'MR' | 'MC',
): CalculatorState {
  switch (operation) {
    case 'M+':
      return memoryAdd(state);
    case 'M-':
      return memorySubtract(state);
    case 'MR':
      return memoryRecall(state);
    case 'MC':
      return memoryClear(state);
  }
}

export function scientificOperation(
  state: CalculatorState,
  fn: ScientificFunction,
  unit: AngleUnit = 'degrees',
): CalculatorState {
  try {
    const currentValue = new Decimal(state.display);
    const result = applyScientificFunction(fn, currentValue, unit);
    const fnName = fn === 'sqrt' ? '√' : fn === 'square' ? 'x²' : fn;

    const historyEntry: HistoryEntry = {
      expression: `${fnName}${currentValue.toString()}`,
      result: formatResult(result),
      timestamp: Date.now(),
    };

    return {
      ...state,
      display: formatResult(result),
      waitingForOperand: true,
      history: [historyEntry, ...state.history].slice(0, 100),
    };
  } catch {
    return {
      ...state,
      display: 'Error',
      waitingForOperand: true,
    };
  }
}

export function inputParenthesis(state: CalculatorState, parenthesis: '(' | ')'): CalculatorState {
  if (parenthesis === '(') {
    if (!state.waitingForOperand && state.display !== '0') {
      return {
        ...state,
        expression: state.expression + state.display + '(',
        waitingForOperand: true,
      };
    }
    return {
      ...state,
      expression: state.expression + '(',
      waitingForOperand: true,
    };
  }

  let exprToEval = state.expression;
  if (state.operator !== null && state.previousValue !== null) {
    exprToEval = `${state.previousValue.toString()} ${state.operator} ${state.display}`;
  } else if (state.expression === '' && state.display !== '0') {
    exprToEval = state.display;
  }
  exprToEval = '(' + exprToEval + ')';

  try {
    const result = evaluateExpression(exprToEval);
    return {
      ...state,
      display: formatResult(result),
      previousValue: null,
      operator: null,
      expression: '',
      waitingForOperand: true,
    };
  } catch {
    return {
      ...state,
      display: 'Error',
      previousValue: null,
      operator: null,
      expression: '',
      waitingForOperand: true,
    };
  }
}

export function backspace(state: CalculatorState): CalculatorState {
  if (state.waitingForOperand) {
    return state;
  }

  if (state.display.length <= 1 || (state.display.length === 2 && state.display.startsWith('-'))) {
    return {
      ...state,
      display: '0',
    };
  }

  return {
    ...state,
    display: state.display.slice(0, -1),
  };
}

export function clearHistory(state: CalculatorState): CalculatorState {
  return {
    ...state,
    history: [],
  };
}

export function getDisplay(state: CalculatorState): string {
  return state.display;
}

export function getExpression(state: CalculatorState): string {
  if (state.expression) {
    return state.expression;
  }
  if (state.operator && state.previousValue !== null) {
    return `${state.previousValue.toString()} ${state.operator}`;
  }
  return state.display;
}
