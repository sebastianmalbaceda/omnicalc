/**
 * @omnicalc/ui — Shared UI Components
 *
 * All shared components live here. Platform-specific layouts stay in apps/.
 * Components must use NativeWind classes and design tokens from tailwind.config.ts.
 */

export { Button } from './Button';
export type { ButtonVariant } from './Button';

export { Display } from './Display';

export { NumericKeypad, OperatorKeypad, ScientificKeypad } from './Keypad';

export { HistoryPanel } from './HistoryPanel';

export { ThemeProvider, useTheme } from './ThemeProvider';
