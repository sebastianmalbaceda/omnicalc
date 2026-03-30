import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import { parseNumber, formatDisplay, evaluateExpression } from '../src/parser.js';
import { CalculatorError } from '../src/errors.js';

describe('parseNumber', () => {
  it('should parse positive integers', () => {
    expect(parseNumber('42').toString()).toBe('42');
  });

  it('should parse negative numbers', () => {
    expect(parseNumber('-42').toString()).toBe('-42');
  });

  it('should parse decimal numbers', () => {
    expect(parseNumber('3.14').toString()).toBe('3.14');
  });

  it('should parse zero', () => {
    expect(parseNumber('0').toString()).toBe('0');
  });

  it('should parse numbers with leading zeros', () => {
    expect(parseNumber('007').toString()).toBe('7');
  });

  it('should parse numbers with trailing zeros', () => {
    expect(parseNumber('100').toString()).toBe('100');
  });

  it('should throw on empty string', () => {
    expect(() => parseNumber('')).toThrow(CalculatorError);
    expect(() => parseNumber('')).toThrow('Empty input');
  });

  it('should throw on whitespace-only string', () => {
    expect(() => parseNumber('   ')).toThrow(CalculatorError);
  });

  it('should throw on invalid input', () => {
    expect(() => parseNumber('abc')).toThrow(CalculatorError);
    expect(() => parseNumber('abc')).toThrow('Invalid number: "abc"');
  });

  it('should handle floating point precision correctly', () => {
    expect(parseNumber('0.1').plus(parseNumber('0.2')).toString()).toBe('0.3');
  });
});

describe('formatDisplay', () => {
  it('should format small numbers normally', () => {
    expect(formatDisplay(parseNumber('123'), 15)).toBe('123');
  });

  it('should format decimal numbers', () => {
    expect(formatDisplay(parseNumber('3.14159'), 15)).toBe('3.14159');
  });

  it('should switch to scientific notation for large numbers', () => {
    const result = formatDisplay(parseNumber('123456789012345'), 15);
    expect(result).toContain('e');
  });

  it('should switch to scientific notation for very small numbers', () => {
    const result = formatDisplay(parseNumber('0.000000000001'), 15);
    expect(result).toContain('e');
  });

  it('should handle negative numbers', () => {
    expect(formatDisplay(parseNumber('-42'), 15)).toBe('-42');
  });

  it('should handle zero', () => {
    expect(formatDisplay(parseNumber('0'), 15)).toBe('0');
    expect(formatDisplay(new Decimal(0), 15)).toBe('0');
  });

  it('should respect maxDigits parameter', () => {
    expect(formatDisplay(parseNumber('123456789'), 5)).toContain('e');
  });
});

describe('evaluateExpression', () => {
  describe('Basic Arithmetic', () => {
    it('should evaluate addition', () => {
      expect(evaluateExpression('2+3').toString()).toBe('5');
    });

    it('should evaluate subtraction', () => {
      expect(evaluateExpression('10-3').toString()).toBe('7');
    });

    it('should evaluate multiplication', () => {
      expect(evaluateExpression('4*5').toString()).toBe('20');
    });

    it('should evaluate division', () => {
      expect(evaluateExpression('100/4').toString()).toBe('25');
    });

    it('should evaluate modulo', () => {
      expect(evaluateExpression('10%3').toString()).toBe('1');
    });
  });

  describe('PEMDAS - Order of Operations', () => {
    it('should handle multiplication before addition', () => {
      expect(evaluateExpression('2+3*4').toString()).toBe('14');
    });

    it('should handle division before subtraction', () => {
      expect(evaluateExpression('10-6/2').toString()).toBe('7');
    });

    it('should handle multiple operations of same precedence left to right', () => {
      expect(evaluateExpression('8/4*2').toString()).toBe('4');
    });

    it('should handle addition and subtraction left to right', () => {
      expect(evaluateExpression('10-3+2').toString()).toBe('9');
    });

    it('should handle complex expressions', () => {
      expect(evaluateExpression('2+3*4-6/2').toString()).toBe('11');
    });

    it('should handle power operator with higher precedence', () => {
      expect(evaluateExpression('2+3^2').toString()).toBe('11');
    });

    it('should handle power operator right associativity', () => {
      expect(evaluateExpression('2^3^2').toString()).toBe('512');
    });
  });

  describe('Parentheses', () => {
    it('should evaluate expressions inside parentheses first', () => {
      expect(evaluateExpression('(2+3)*4').toString()).toBe('20');
    });

    it('should handle nested parentheses', () => {
      expect(evaluateExpression('((2+3)*4)').toString()).toBe('20');
    });

    it('should handle multiple parentheses groups', () => {
      expect(evaluateExpression('(2+3)*(4+5)').toString()).toBe('45');
    });

    it('should handle deeply nested parentheses', () => {
      expect(evaluateExpression('(((1+2)))').toString()).toBe('3');
    });

    it('should handle parentheses with complex expressions', () => {
      expect(evaluateExpression('(2+3*4)-6/2').toString()).toBe('11');
    });
  });

  describe('Decimal Precision', () => {
    it('should handle 0.1 + 0.2 = 0.3', () => {
      expect(evaluateExpression('0.1+0.2').toString()).toBe('0.3');
    });

    it('should handle 0.1 * 0.2', () => {
      const result = evaluateExpression('0.1*0.2');
      expect(result.toString()).toBe('0.02');
    });

    it('should handle division with decimals', () => {
      expect(evaluateExpression('1/3').toString()).toBe('0.33333333333333333333');
    });

    it('should handle large decimal calculations', () => {
      expect(evaluateExpression('123.456+789.012').toString()).toBe('912.468');
    });
  });

  describe('Constants', () => {
    it('should handle pi (π)', () => {
      const result = evaluateExpression('π*2');
      expect(parseFloat(result.toString()).toFixed(4)).toBe('6.2832');
    });

    it('should handle e as constant', () => {
      const result = evaluateExpression('e*1');
      expect(parseFloat(result.toString()).toFixed(5)).toBe('2.71828');
    });

    it('should handle pi in complex expressions', () => {
      const result = evaluateExpression('π/2');
      expect(parseFloat(result.toString()).toFixed(10)).toBe('1.5707963268');
    });
  });

  describe('Negative Numbers', () => {
    it('should handle subtraction resulting in negative', () => {
      expect(evaluateExpression('3-8').toString()).toBe('-5');
    });

    it('should handle multiplication with negative result via subtraction', () => {
      expect(evaluateExpression('2-6').toString()).toBe('-4');
    });

    it('should handle division with negative result via subtraction', () => {
      expect(evaluateExpression('5-8').toString()).toBe('-3');
    });

    it('should handle leading unary negative number', () => {
      expect(evaluateExpression('-5+3').toString()).toBe('-2');
    });

    it('should handle unary negative with decimal', () => {
      expect(evaluateExpression('-0.5+0.3').toString()).toBe('-0.2');
    });

    it('should handle unary negative after parenthesis', () => {
      expect(evaluateExpression('(-2)*(-3)').toString()).toBe('6');
    });

    it('should handle unary negative in complex expression', () => {
      expect(evaluateExpression('-5*2+10').toString()).toBe('0');
    });
  });

  describe('Error Handling', () => {
    it('should throw on division by zero', () => {
      expect(() => evaluateExpression('1/0')).toThrow(CalculatorError);
      expect(() => evaluateExpression('1/0')).toThrow('Cannot divide by zero');
    });

    it('should throw on modulo by zero', () => {
      expect(() => evaluateExpression('5%0')).toThrow(CalculatorError);
    });

    it('should throw on empty expression', () => {
      expect(() => evaluateExpression('')).toThrow(CalculatorError);
    });

    it('should throw on mismatched parentheses', () => {
      expect(() => evaluateExpression('(2+3')).toThrow(CalculatorError);
      expect(() => evaluateExpression('(2+3')).toThrow('Mismatched parentheses');
    });

    it('should throw on extra closing parenthesis', () => {
      expect(() => evaluateExpression('(2+3))')).toThrow(CalculatorError);
    });

    it('should throw on invalid characters', () => {
      expect(() => evaluateExpression('2&3')).toThrow(CalculatorError);
      expect(() => evaluateExpression('2&3')).toThrow('Unexpected character');
    });

    it('should throw on invalid number', () => {
      expect(() => evaluateExpression('abc')).toThrow(CalculatorError);
    });
  });

  describe('Complex Expressions', () => {
    it('should evaluate expression from SPEC.md example', () => {
      expect(evaluateExpression('25*(4+6)').toString()).toBe('250');
    });

    it('should handle scientific notation in result', () => {
      const result = evaluateExpression('10^20');
      expect(result.greaterThan(new Decimal(1e19))).toBe(true);
    });

    it('should handle expression with all operators', () => {
      expect(evaluateExpression('2+3*4-6/2+1').toString()).toBe('12');
    });

    it('should handle expression with power and modulo', () => {
      expect(evaluateExpression('2^3+10%3').toString()).toBe('9');
    });

    it('should handle complex parentheses structure', () => {
      expect(evaluateExpression('(2+3)*(4+5)/3').toString()).toBe('15');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single number', () => {
      expect(evaluateExpression('42').toString()).toBe('42');
    });

    it('should handle single number with spaces', () => {
      expect(evaluateExpression('  42  ').toString()).toBe('42');
    });

    it('should handle multiple spaces between numbers', () => {
      expect(evaluateExpression('2   +   3').toString()).toBe('5');
    });

    it('should handle leading zeros', () => {
      expect(evaluateExpression('007+003').toString()).toBe('10');
    });

    it('should handle trailing decimal point', () => {
      const result = evaluateExpression('5.+3');
      expect(parseFloat(result.toString())).toBe(8);
    });
  });
});
