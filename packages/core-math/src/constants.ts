/**
 * @omnicalc/core-math — Constants
 *
 * Mathematical constants using decimal.js for precision.
 */

import Decimal from 'decimal.js';

export const PI: Decimal = Decimal.acos(-1);
export const E: Decimal = new Decimal(1).exp();
export const LN2: Decimal = new Decimal(2).ln();
export const LN10: Decimal = new Decimal(10).ln();
export const SQRT2: Decimal = new Decimal(2).sqrt();

/** Maximum display digits before switching to scientific notation */
export const MAX_DISPLAY_DIGITS = 15;
