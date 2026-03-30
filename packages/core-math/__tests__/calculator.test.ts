import { describe, it, expect, beforeEach } from 'vitest';
import {
  createCalculatorState,
  inputDigit,
  inputOperator,
  calculate,
  calculateExpression,
  clear,
  clearEntry,
  toggleSign,
  percentage,
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
} from '../src/calculator.js';

describe('Calculator State Machine', () => {
  let state: ReturnType<typeof createCalculatorState>;

  beforeEach(() => {
    state = createCalculatorState();
  });

  describe('createCalculatorState', () => {
    it('should create initial state with display 0', () => {
      expect(state.display).toBe('0');
    });

    it('should have empty expression', () => {
      expect(state.expression).toBe('');
    });

    it('should have null previousValue', () => {
      expect(state.previousValue).toBeNull();
    });

    it('should have no operator', () => {
      expect(state.operator).toBeNull();
    });

    it('should have zero memory', () => {
      expect(state.memory.toString()).toBe('0');
    });

    it('should have empty history', () => {
      expect(state.history).toEqual([]);
    });
  });

  describe('inputDigit', () => {
    it('should replace 0 when inputting first digit', () => {
      state = inputDigit(state, '5');
      expect(state.display).toBe('5');
    });

    it('should append digits to display', () => {
      state = inputDigit(state, '5');
      state = inputDigit(state, '3');
      expect(state.display).toBe('53');
    });

    it('should handle decimal point', () => {
      state = inputDigit(state, '3');
      state = inputDigit(state, '.');
      state = inputDigit(state, '1');
      expect(state.display).toBe('3.1');
    });

    it('should not allow multiple decimal points', () => {
      state = inputDigit(state, '3');
      state = inputDigit(state, '.');
      state = inputDigit(state, '.');
      state = inputDigit(state, '1');
      expect(state.display).toBe('3.1');
    });

    it('should reset display after operator when waiting for operand', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      expect(state.display).toBe('3');
    });

    it('should limit display length to MAX_DISPLAY_DIGITS', () => {
      for (let i = 0; i < 20; i++) {
        state = inputDigit(state, '1');
      }
      expect(state.display.length).toBeLessThanOrEqual(16);
    });
  });

  describe('inputOperator', () => {
    it('should set operator and previousValue on first operator input', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      expect(state.operator).toBe('+');
      expect(state.previousValue?.toString()).toBe('5');
      expect(state.waitingForOperand).toBe(true);
    });

    it('should chain operations when pressing operator after previous operation', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = inputOperator(state, '*');
      expect(state.previousValue?.toString()).toBe('8');
      expect(state.operator).toBe('*');
    });

    it('should update expression correctly', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      expect(state.expression).toBe('5 +');
    });

    it('should not chain if waiting for operand (change operator)', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputOperator(state, '-');
      expect(state.operator).toBe('-');
      expect(state.previousValue?.toString()).toBe('5');
    });
  });

  describe('calculate', () => {
    it('should perform calculation when equals is pressed', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = calculate(state);
      expect(state.display).toBe('8');
    });

    it('should add to history on calculation', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = calculate(state);
      expect(state.history.length).toBe(1);
      expect(state.history[0].expression).toBe('5 + 3');
      expect(state.history[0].result).toBe('8');
    });

    it('should set waitingForOperand after calculation', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = calculate(state);
      expect(state.waitingForOperand).toBe(true);
    });

    it('should not calculate if no operator is set', () => {
      state = inputDigit(state, '5');
      const newState = calculate(state);
      expect(newState.display).toBe('5');
      expect(newState.history.length).toBe(0);
    });

    it('should return Error state on division by zero', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '/');
      state = inputDigit(state, '0');
      state = calculate(state);
      expect(state.display).toBe('Error');
    });

    it('should chain calculations correctly', () => {
      state = inputDigit(state, '10');
      state = inputOperator(state, '/');
      state = inputDigit(state, '5');
      state = calculate(state);
      expect(state.display).toBe('2');

      state = inputOperator(state, '+');
      state = inputDigit(state, '8');
      state = calculate(state);
      expect(state.display).toBe('10');
    });
  });

  describe('calculateExpression', () => {
    it('should evaluate a full expression string', () => {
      state = calculateExpression(state, '25*(4+6)');
      expect(state.display).toBe('250');
    });

    it('should add to history when evaluating expression', () => {
      state = calculateExpression(state, '2+3*4');
      expect(state.history.length).toBe(1);
      expect(state.history[0].expression).toBe('2+3*4');
      expect(state.history[0].result).toBe('14');
    });

    it('should return Error for invalid expression', () => {
      state = calculateExpression(state, '2+');
      expect(state.display).toBe('Error');
    });

    it('should return Error for division by zero in expression', () => {
      state = calculateExpression(state, '1/0');
      expect(state.display).toBe('Error');
    });

    it('should handle complex nested expressions', () => {
      state = calculateExpression(state, '((2+3)*4)-6/2');
      expect(state.display).toBe('17');
    });
  });

  describe('clear', () => {
    it('should reset display to 0', () => {
      state = inputDigit(state, '5');
      state = clear(state);
      expect(state.display).toBe('0');
    });

    it('should reset all state except history', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = calculate(state);
      state = clear(state);
      expect(state.display).toBe('0');
      expect(state.previousValue).toBeNull();
      expect(state.operator).toBeNull();
      expect(state.history.length).toBe(1);
    });
  });

  describe('clearEntry', () => {
    it('should only clear current entry', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = clearEntry(state);
      expect(state.display).toBe('0');
      expect(state.previousValue?.toString()).toBe('5');
      expect(state.operator).toBe('+');
    });
  });

  describe('toggleSign', () => {
    it('should toggle positive to negative', () => {
      state = inputDigit(state, '5');
      state = toggleSign(state);
      expect(state.display).toBe('-5');
    });

    it('should toggle negative to positive', () => {
      state = inputDigit(state, '5');
      state = toggleSign(state);
      state = toggleSign(state);
      expect(state.display).toBe('5');
    });

    it('should not toggle zero', () => {
      state = toggleSign(state);
      expect(state.display).toBe('0');
    });
  });

  describe('percentage', () => {
    it('should convert number to percentage', () => {
      state = inputDigit(state, '5');
      state = inputDigit(state, '0');
      state = percentage(state);
      expect(state.display).toBe('0.5');
    });

    it('should set waitingForOperand after percentage', () => {
      state = inputDigit(state, '5');
      state = percentage(state);
      expect(state.waitingForOperand).toBe(true);
    });
  });

  describe('Memory Operations', () => {
    it('should add to memory with M+', () => {
      state = inputDigit(state, '5');
      state = memoryAdd(state);
      expect(state.memory.toString()).toBe('5');
    });

    it('should subtract from memory with M-', () => {
      state = inputDigit(state, '5');
      state = memorySubtract(state);
      expect(state.memory.toString()).toBe('-5');
    });

    it('should accumulate memory values', () => {
      state = inputDigit(state, '5');
      state = memoryAdd(state);
      state = inputDigit(state, '3');
      state = memoryAdd(state);
      expect(state.memory.toString()).toBe('8');
    });

    it('should recall memory with MR', () => {
      state = inputDigit(state, '5');
      state = memoryAdd(state);
      state = memoryRecall(state);
      expect(state.display).toBe('5');
    });

    it('should clear memory with MC', () => {
      state = inputDigit(state, '5');
      state = memoryAdd(state);
      state = memoryClear(state);
      expect(state.memory.toString()).toBe('0');
    });

    it('should apply memory operation correctly', () => {
      state = inputDigit(state, '10');
      state = applyMemoryOperation(state, 'M+');
      expect(state.memory.toString()).toBe('10');

      state = applyMemoryOperation(state, 'MR');
      expect(state.display).toBe('10');

      state = applyMemoryOperation(state, 'MC');
      expect(state.memory.toString()).toBe('0');
    });
  });

  describe('scientificOperation', () => {
    it('should apply sqrt correctly', () => {
      state = inputDigit(state, '4');
      state = scientificOperation(state, 'sqrt');
      expect(state.display).toBe('2');
    });

    it('should apply square correctly', () => {
      state = inputDigit(state, '5');
      state = scientificOperation(state, 'square');
      expect(state.display).toBe('25');
    });

    it('should apply sin correctly', () => {
      state = inputDigit(state, '9');
      state = scientificOperation(state, 'sin', 'degrees');
      const result = parseFloat(state.display);
      expect(result).toBeCloseTo(0.1564, 3);
    });

    it('should add to history after scientific operation', () => {
      state = inputDigit(state, '4');
      state = scientificOperation(state, 'sqrt');
      expect(state.history.length).toBe(1);
      expect(state.history[0].expression).toBe('√4');
      expect(state.history[0].result).toBe('2');
    });

    it('should return Error for invalid domain', () => {
      state = inputDigit(state, '-');
      state = inputDigit(state, '1');
      state = scientificOperation(state, 'sqrt');
      expect(state.display).toBe('Error');
    });
  });

  describe('inputParenthesis', () => {
    it('should handle opening parenthesis', () => {
      state = inputParenthesis(state, '(');
      expect(state.expression).toContain('(');
    });

    it('should handle closing parenthesis and evaluate', () => {
      state = inputDigit(state, '2');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = inputParenthesis(state, ')');
      expect(state.display).toBe('5');
    });

    it('should handle closing parenthesis and evaluate', () => {
      state = inputDigit(state, '2');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = inputParenthesis(state, ')');
      expect(state.display).toBe('5');
    });
  });

  describe('backspace', () => {
    it('should delete last digit', () => {
      state = inputDigit(state, '5');
      state = inputDigit(state, '3');
      state = backspace(state);
      expect(state.display).toBe('5');
    });

    it('should reset to 0 when backspacing last digit', () => {
      state = inputDigit(state, '5');
      state = backspace(state);
      expect(state.display).toBe('0');
    });

    it('should handle negative numbers in backspace', () => {
      state = inputDigit(state, '5');
      state = toggleSign(state);
      state = backspace(state);
      expect(state.display).toBe('0');
    });

    it('should not do anything when waiting for operand', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = backspace(state);
      expect(state.display).toBe('5');
    });
  });

  describe('clearHistory', () => {
    it('should clear all history entries', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = calculate(state);
      expect(state.history.length).toBe(1);

      state = clearHistory(state);
      expect(state.history.length).toBe(0);
    });

    it('should not affect other state', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      state = inputDigit(state, '3');
      state = calculate(state);
      state = clearHistory(state);
      expect(state.display).toBe('8');
    });
  });

  describe('getDisplay', () => {
    it('should return current display value', () => {
      state = inputDigit(state, '5');
      expect(getDisplay(state)).toBe('5');
    });
  });

  describe('getExpression', () => {
    it('should return current expression', () => {
      state = inputDigit(state, '5');
      state = inputOperator(state, '+');
      expect(getExpression(state)).toBe('5 +');
    });

    it('should return display when no expression', () => {
      state = inputDigit(state, '5');
      expect(getExpression(state)).toBe('5');
    });
  });

  describe('0.1 + 0.2 = 0.3', () => {
    it('should correctly compute 0.1 + 0.2 using state machine', () => {
      state = inputDigit(state, '0');
      state = inputDigit(state, '.');
      state = inputDigit(state, '1');
      state = inputOperator(state, '+');
      state = inputDigit(state, '0');
      state = inputDigit(state, '.');
      state = inputDigit(state, '2');
      state = calculate(state);
      expect(state.display).toBe('0.3');
    });
  });

  describe('Error Handling', () => {
    it('should return Error when evaluating invalid expression', () => {
      const result = calculateExpression(state, '2++3');
      expect(result.display).toBe('Error');
    });

    it('should return Error for invalid domain in scientific operation', () => {
      state = inputDigit(state, '-');
      state = inputDigit(state, '1');
      state = scientificOperation(state, 'sqrt');
      expect(state.display).toBe('Error');
    });

    it('should return Error state for invalid parenthesis expression', () => {
      state = calculateExpression(state, '(');
      expect(state.display).toBe('Error');
    });

    it('should clear error state on clear', () => {
      state = calculateExpression(state, '(');
      expect(state.display).toBe('Error');
      state = clear(state);
      expect(state.display).toBe('0');
    });
  });
});
