import { describe, it, expect } from 'vitest';
import Decimal from 'decimal.js';
import { add, subtract, multiply, divide, modulo, negate, percentage } from '../src/operations.js';
import { CalculatorError } from '../src/errors.js';

describe('Basic Operations', () => {
  it('adds two numbers correctly', () => {
    const result = add(new Decimal('0.1'), new Decimal('0.2'));
    expect(result.toString()).toBe('0.3');
  });

  it('subtracts two numbers correctly', () => {
    const result = subtract(new Decimal('10'), new Decimal('3'));
    expect(result.toString()).toBe('7');
  });

  it('multiplies two numbers correctly', () => {
    const result = multiply(new Decimal('25'), new Decimal('4'));
    expect(result.toString()).toBe('100');
  });

  it('divides two numbers correctly', () => {
    const result = divide(new Decimal('100'), new Decimal('4'));
    expect(result.toString()).toBe('25');
  });

  it('throws on division by zero', () => {
    expect(() => divide(new Decimal('10'), new Decimal('0'))).toThrow(CalculatorError);
    expect(() => divide(new Decimal('10'), new Decimal('0'))).toThrow('Cannot divide by zero');
  });

  it('calculates modulo correctly', () => {
    const result = modulo(new Decimal('10'), new Decimal('3'));
    expect(result.toString()).toBe('1');
  });

  it('throws on modulo by zero', () => {
    expect(() => modulo(new Decimal('10'), new Decimal('0'))).toThrow(CalculatorError);
  });

  it('negates a value', () => {
    expect(negate(new Decimal('5')).toString()).toBe('-5');
    expect(negate(new Decimal('-3')).toString()).toBe('3');
  });

  it('calculates percentage', () => {
    const result = percentage(new Decimal('50'));
    expect(result.toString()).toBe('0.5');
  });

  it('handles floating-point precision (0.1 + 0.2 = 0.3)', () => {
    const result = add(new Decimal('0.1'), new Decimal('0.2'));
    expect(result.equals(new Decimal('0.3'))).toBe(true);
  });
});
