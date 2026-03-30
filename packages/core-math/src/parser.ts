/**
 * @omnicalc/core-math — Expression Parser
 *
 * Parses and evaluates string expressions with full PEMDAS support.
 * Uses the Shunting-yard algorithm for operator precedence.
 */

import Decimal from 'decimal.js';
import { syntaxError, divisionByZeroError } from './errors.js';
import { PI, E } from './constants.js';

type TokenType = 'number' | 'operator' | 'paren';

interface Token {
  type: TokenType;
  value: string;
  precedence?: number;
  rightAssociative?: boolean;
  isUnaryMinus?: boolean;
}

function charAt(expr: string, i: number): string {
  return expr[i] ?? '';
}

function isOperatorChar(char: string): boolean {
  return '+-*/%^'.includes(char);
}

function isStartOfExpression(position: number, expr: string): boolean {
  if (position === 0) return true;
  const prevChar = charAt(expr, position - 1);
  return prevChar === '(' || isOperatorChar(prevChar);
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const expr = expression.replace(/\s+/g, '');

  while (i < expr.length) {
    const char = charAt(expr, i);

    if (/[0-9.]/.test(char)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(charAt(expr, i))) {
        num += charAt(expr, i);
        i++;
      }
      if (num === '.' || num.endsWith('.')) {
        num = num === '.' ? '0.' : num;
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    if (char === 'π') {
      tokens.push({ type: 'number', value: PI.toString() });
      i++;
      continue;
    }

    if (char === 'e' && isStartOfExpression(i, expr)) {
      tokens.push({ type: 'number', value: E.toString() });
      i++;
      continue;
    }

    if (char === '-' && isStartOfExpression(i, expr)) {
      i++;
      let num = '';
      while (i < expr.length && /[0-9.]/.test(charAt(expr, i))) {
        num += charAt(expr, i);
        i++;
      }
      if (num === '' || num === '.') {
        num = num === '' ? '0' : '0.';
      }
      const value = new Decimal(num).negated();
      tokens.push({ type: 'number', value: value.toString() });
      continue;
    }

    if ('+-*/%^'.includes(char)) {
      const precedence = '^'.includes(char) ? 4 : '*/%'.includes(char) ? 3 : 2;
      const rightAssociative = '^'.includes(char);
      tokens.push({ type: 'operator', value: char, precedence, rightAssociative });
      i++;
      continue;
    }

    if ('('.includes(char)) {
      tokens.push({ type: 'paren', value: '(' });
      i++;
      continue;
    }

    if (')'.includes(char)) {
      tokens.push({ type: 'paren', value: ')' });
      i++;
      continue;
    }

    throw syntaxError(`Unexpected character: "${char}"`);
  }

  return tokens;
}

function applyOp(a: Decimal, operator: string, b: Decimal): Decimal {
  switch (operator) {
    case '+':
      return a.plus(b);
    case '-':
      return a.minus(b);
    case '*':
      return a.times(b);
    case '/':
      if (b.isZero()) {
        throw divisionByZeroError();
      }
      return a.dividedBy(b);
    case '%':
      if (b.isZero()) {
        throw divisionByZeroError();
      }
      return a.modulo(b);
    case '^':
      return a.pow(b);
    default:
      throw syntaxError(`Unknown operator: "${operator}"`);
  }
}

function evaluateRPN(tokens: Token[]): Decimal {
  const stack: Decimal[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      stack.push(new Decimal(token.value));
    } else if (token.type === 'operator') {
      if (stack.length < 2) {
        throw syntaxError('Invalid expression');
      }
      const b = stack.pop() as Decimal;
      const a = stack.pop() as Decimal;
      stack.push(applyOp(a, token.value, b));
    }
  }

  if (stack.length !== 1) {
    throw syntaxError('Invalid expression');
  }

  return stack[0] as Decimal;
}

function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const opStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
    } else if (token.type === 'operator') {
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1] as Token;
        if (top.type === 'paren') break;
        const topPrecedence = top.precedence ?? 0;
        const tokenPrecedence = token.precedence ?? 0;
        if (token.rightAssociative) {
          if (tokenPrecedence < topPrecedence) {
            output.push(opStack.pop() as Token);
          } else {
            break;
          }
        } else {
          if (tokenPrecedence <= topPrecedence) {
            output.push(opStack.pop() as Token);
          } else {
            break;
          }
        }
      }
      opStack.push(token);
    } else if (token.value === '(') {
      opStack.push(token);
    } else if (token.value === ')') {
      while (opStack.length > 0 && (opStack[opStack.length - 1] as Token).value !== '(') {
        output.push(opStack.pop() as Token);
      }
      if (opStack.length === 0) {
        throw syntaxError('Mismatched parentheses');
      }
      opStack.pop();
    }
  }

  while (opStack.length > 0) {
    const op = opStack.pop() as Token;
    if (op.value === '(' || op.value === ')') {
      throw syntaxError('Mismatched parentheses');
    }
    output.push(op);
  }

  return output;
}

export function parseNumber(input: string): Decimal {
  const trimmed = input.trim();
  if (trimmed === '') {
    throw syntaxError('Empty input');
  }
  try {
    return new Decimal(trimmed);
  } catch {
    throw syntaxError(`Invalid number: "${trimmed}"`);
  }
}

export function evaluateExpression(expression: string): Decimal {
  if (!expression || expression.trim() === '') {
    throw syntaxError('Empty expression');
  }

  const tokens = tokenize(expression);
  const rpn = toRPN(tokens);
  return evaluateRPN(rpn);
}

export function formatDisplay(value: Decimal, maxDigits: number = 15): string {
  if (value.isZero()) {
    return '0';
  }

  const absValue = value.abs();

  if (
    absValue.greaterThan(new Decimal(10).pow(maxDigits - 1)) ||
    (absValue.isPositive() && absValue.lessThan(new Decimal(10).pow(-(maxDigits - 2))))
  ) {
    return value.toExponential(maxDigits - 3);
  }

  const trimmed = value.toString();
  if (trimmed.replace(/[-.]/, '').length > maxDigits) {
    return value.toExponential(maxDigits - 3);
  }

  return trimmed;
}
