import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import {
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
} from '../src/scientific.js';
import { CalculatorError } from '../src/errors.js';
import { E } from '../src/constants.js';

describe('Scientific Functions', () => {
  describe('sin', () => {
    it('should calculate sin of 0 degrees', () => {
      expect(sin(new Decimal(0), 'degrees').toString()).toBe('0');
    });

    it('should calculate sin of 90 degrees', () => {
      const result = sin(new Decimal(90), 'degrees');
      expect(result.toString()).toBe('1');
    });

    it('should calculate sin of 30 degrees', () => {
      const result = sin(new Decimal(30), 'degrees');
      expect(result.toFixed(10)).toBe('0.5000000000');
    });

    it('should calculate sin in radians', () => {
      const result = sin(new Decimal(Math.PI / 2), 'radians');
      expect(result.toFixed(10)).toBe('1.0000000000');
    });

    it('should calculate sin of negative angle', () => {
      const result = sin(new Decimal(-90), 'degrees');
      expect(result.toString()).toBe('-1');
    });
  });

  describe('cos', () => {
    it('should calculate cos of 0 degrees', () => {
      expect(cos(new Decimal(0), 'degrees').toString()).toBe('1');
    });

    it('should calculate cos of 90 degrees', () => {
      const result = cos(new Decimal(90), 'degrees');
      expect(result.abs().lessThan(new Decimal('1e-10'))).toBe(true);
    });

    it('should calculate cos of 60 degrees', () => {
      const result = cos(new Decimal(60), 'degrees');
      expect(result.toFixed(10)).toBe('0.5000000000');
    });

    it('should calculate cos in radians', () => {
      const result = cos(new Decimal(0), 'radians');
      expect(result.toString()).toBe('1');
    });
  });

  describe('tan', () => {
    it('should calculate tan of 0 degrees', () => {
      expect(tan(new Decimal(0), 'degrees').toString()).toBe('0');
    });

    it('should calculate tan of 45 degrees', () => {
      const result = tan(new Decimal(45), 'degrees');
      expect(result.toFixed(10)).toBe('1.0000000000');
    });

    it('should throw domain error for 90 degrees', () => {
      expect(() => tan(new Decimal(90), 'degrees').toString()).not.toBe('Infinity');
    });
  });

  describe('asin', () => {
    it('should calculate asin of 0', () => {
      expect(asin(new Decimal(0)).toString()).toBe('0');
    });

    it('should calculate asin of 1', () => {
      const result = asin(new Decimal(1));
      expect(result.toFixed(10)).toBe('1.5707963268');
    });

    it('should calculate asin of -1', () => {
      const result = asin(new Decimal(-1));
      expect(result.toFixed(10)).toBe('-1.5707963268');
    });

    it('should throw domain error for values greater than 1', () => {
      expect(() => asin(new Decimal(2))).toThrow(CalculatorError);
      expect(() => asin(new Decimal(2))).toThrow('Invalid input for asin');
    });

    it('should throw domain error for values less than -1', () => {
      expect(() => asin(new Decimal(-2))).toThrow(CalculatorError);
    });
  });

  describe('acos', () => {
    it('should calculate acos of 1', () => {
      expect(acos(new Decimal(1)).toString()).toBe('0');
    });

    it('should calculate acos of 0', () => {
      const result = acos(new Decimal(0));
      expect(result.toFixed(10)).toBe('1.5707963268');
    });

    it('should throw domain error for values greater than 1', () => {
      expect(() => acos(new Decimal(2))).toThrow(CalculatorError);
      expect(() => acos(new Decimal(2))).toThrow('Invalid input for acos');
    });

    it('should throw domain error for values less than -1', () => {
      expect(() => acos(new Decimal(-2))).toThrow(CalculatorError);
    });
  });

  describe('atan', () => {
    it('should calculate atan of 0', () => {
      expect(atan(new Decimal(0)).toString()).toBe('0');
    });

    it('should calculate atan of 1', () => {
      const result = atan(new Decimal(1));
      expect(result.toFixed(10)).toBe('0.7853981634');
    });

    it('should calculate atan of infinity', () => {
      const result = atan(new Decimal(Infinity));
      expect(result.toFixed(10)).toBe('1.5707963268');
    });
  });

  describe('log', () => {
    it('should calculate log of 1', () => {
      expect(log(new Decimal(1)).toString()).toBe('0');
    });

    it('should calculate log of 10', () => {
      expect(log(new Decimal(10)).toString()).toBe('1');
    });

    it('should calculate log of 100', () => {
      expect(log(new Decimal(100)).toString()).toBe('2');
    });

    it('should calculate log of 0.1', () => {
      const result = log(new Decimal(0.1));
      expect(result.toString()).toBe('-1');
    });

    it('should throw domain error for 0', () => {
      expect(() => log(new Decimal(0))).toThrow(CalculatorError);
      expect(() => log(new Decimal(0))).toThrow('Invalid input for log');
    });

    it('should throw domain error for negative numbers', () => {
      expect(() => log(new Decimal(-1))).toThrow(CalculatorError);
    });
  });

  describe('ln', () => {
    it('should calculate ln of 1', () => {
      expect(ln(new Decimal(1)).toString()).toBe('0');
    });

    it('should calculate ln of e', () => {
      expect(ln(E).toString()).toBe('1');
    });

    it('should calculate ln of e^2', () => {
      const result = ln(new Decimal(Math.E * Math.E));
      expect(result.toFixed(5)).toBe('2.00000');
    });

    it('should throw domain error for 0', () => {
      expect(() => ln(new Decimal(0))).toThrow(CalculatorError);
    });

    it('should throw domain error for negative numbers', () => {
      expect(() => ln(new Decimal(-1))).toThrow(CalculatorError);
    });
  });

  describe('sqrt', () => {
    it('should calculate sqrt of 0', () => {
      expect(sqrt(new Decimal(0)).toString()).toBe('0');
    });

    it('should calculate sqrt of 1', () => {
      expect(sqrt(new Decimal(1)).toString()).toBe('1');
    });

    it('should calculate sqrt of 4', () => {
      expect(sqrt(new Decimal(4)).toString()).toBe('2');
    });

    it('should calculate sqrt of 2', () => {
      const result = sqrt(new Decimal(2));
      expect(result.toFixed(10)).toBe('1.4142135624');
    });

    it('should calculate sqrt of 0.25', () => {
      const result = sqrt(new Decimal(0.25));
      expect(result.toString()).toBe('0.5');
    });

    it('should throw domain error for negative numbers', () => {
      expect(() => sqrt(new Decimal(-1))).toThrow(CalculatorError);
      expect(() => sqrt(new Decimal(-1))).toThrow('Invalid input for sqrt');
    });
  });

  describe('square', () => {
    it('should calculate square of 0', () => {
      expect(square(new Decimal(0)).toString()).toBe('0');
    });

    it('should calculate square of 1', () => {
      expect(square(new Decimal(1)).toString()).toBe('1');
    });

    it('should calculate square of 5', () => {
      expect(square(new Decimal(5)).toString()).toBe('25');
    });

    it('should calculate square of -3', () => {
      expect(square(new Decimal(-3)).toString()).toBe('9');
    });

    it('should calculate square of 0.5', () => {
      const result = square(new Decimal(0.5));
      expect(result.toString()).toBe('0.25');
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of 0', () => {
      expect(factorial(new Decimal(0)).toString()).toBe('1');
    });

    it('should calculate factorial of 1', () => {
      expect(factorial(new Decimal(1)).toString()).toBe('1');
    });

    it('should calculate factorial of 5', () => {
      expect(factorial(new Decimal(5)).toString()).toBe('120');
    });

    it('should calculate factorial of 10', () => {
      expect(factorial(new Decimal(10)).toString()).toBe('3628800');
    });

    it('should throw domain error for negative numbers', () => {
      expect(() => factorial(new Decimal(-1))).toThrow(CalculatorError);
      expect(() => factorial(new Decimal(-1))).toThrow('Invalid input for factorial');
    });

    it('should throw domain error for non-integers', () => {
      expect(() => factorial(new Decimal(2.5))).toThrow(CalculatorError);
    });
  });

  describe('reciprocal', () => {
    it('should calculate reciprocal of 1', () => {
      expect(reciprocal(new Decimal(1)).toString()).toBe('1');
    });

    it('should calculate reciprocal of 2', () => {
      expect(reciprocal(new Decimal(2)).toString()).toBe('0.5');
    });

    it('should calculate reciprocal of 0.5', () => {
      expect(reciprocal(new Decimal(0.5)).toString()).toBe('2');
    });

    it('should throw domain error for 0', () => {
      expect(() => reciprocal(new Decimal(0))).toThrow(CalculatorError);
      expect(() => reciprocal(new Decimal(0))).toThrow('Invalid input for reciprocal');
    });
  });

  describe('applyScientificFunction', () => {
    it('should apply sin function', () => {
      const result = applyScientificFunction('sin', new Decimal(90), 'degrees');
      expect(result.toString()).toBe('1');
    });

    it('should apply cos function', () => {
      const result = applyScientificFunction('cos', new Decimal(0), 'degrees');
      expect(result.toString()).toBe('1');
    });

    it('should apply tan function', () => {
      const result = applyScientificFunction('tan', new Decimal(45), 'degrees');
      expect(result.toFixed(10)).toBe('1.0000000000');
    });

    it('should apply sqrt function', () => {
      const result = applyScientificFunction('sqrt', new Decimal(4), 'degrees');
      expect(result.toString()).toBe('2');
    });

    it('should apply log function', () => {
      const result = applyScientificFunction('log', new Decimal(100), 'degrees');
      expect(result.toString()).toBe('2');
    });

    it('should apply ln function', () => {
      const result = applyScientificFunction('ln', E, 'degrees');
      expect(result.toString()).toBe('1');
    });

    it('should apply square function', () => {
      const result = applyScientificFunction('square', new Decimal(5), 'degrees');
      expect(result.toString()).toBe('25');
    });

    it('should apply factorial function', () => {
      const result = applyScientificFunction('factorial', new Decimal(5), 'degrees');
      expect(result.toString()).toBe('120');
    });

    it('should apply reciprocal function', () => {
      const result = applyScientificFunction('reciprocal', new Decimal(2), 'degrees');
      expect(result.toString()).toBe('0.5');
    });

    it('should apply asin function', () => {
      const result = applyScientificFunction('asin', new Decimal(0), 'degrees');
      expect(result.toString()).toBe('0');
    });

    it('should apply acos function', () => {
      const result = applyScientificFunction('acos', new Decimal(1), 'degrees');
      expect(result.toString()).toBe('0');
    });

    it('should apply atan function', () => {
      const result = applyScientificFunction('atan', new Decimal(0), 'degrees');
      expect(result.toString()).toBe('0');
    });
  });

  describe('precision', () => {
    it('should handle 0.1 + 0.2 correctly in trigonometric context', () => {
      const result = sin(new Decimal(0.1), 'degrees');
      expect(result.toFixed(15)).toBe('0.001745328365898');
    });

    it('should maintain precision for large factorials', () => {
      const result = factorial(new Decimal(20));
      expect(result.toString()).toBe('2432902008176640000');
    });

    it('should handle very small numbers in log', () => {
      const result = log(new Decimal(0.0001));
      expect(result.toString()).toBe('-4');
    });
  });
});
