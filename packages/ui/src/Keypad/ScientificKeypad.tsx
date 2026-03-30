import React from 'react';
import { View } from 'react-native';
import { Button } from '../Button';
import type { ScientificFunction } from '@omnicalc/core-math';

interface ScientificKeypadProps {
  onFunction: (fn: ScientificFunction) => void;
  onInputPi: () => void;
  onInputE: () => void;
  onPower: () => void;
  onReciprocal: () => void;
  onParenthesis: (parens: '(' | ')') => void;
  isPro?: boolean;
  className?: string;
}

const SCIENTIFIC_FUNCTIONS: { label: string; fn: ScientificFunction }[][] = [
  [
    { label: 'sin', fn: 'sin' },
    { label: 'cos', fn: 'cos' },
    { label: 'tan', fn: 'tan' },
  ],
  [
    { label: 'asin', fn: 'asin' },
    { label: 'acos', fn: 'acos' },
    { label: 'atan', fn: 'atan' },
  ],
  [
    { label: 'log', fn: 'log' },
    { label: 'ln', fn: 'ln' },
    { label: '√', fn: 'sqrt' },
  ],
  [
    { label: 'x²', fn: 'square' },
    { label: 'n!', fn: 'factorial' },
  ],
];

export function ScientificKeypad({
  onFunction,
  onInputPi,
  onInputE,
  onPower,
  onReciprocal,
  onParenthesis,
  isPro = false,
  className = '',
}: ScientificKeypadProps): React.ReactElement {
  if (!isPro) {
    return (
      <View className={className}>
        <View className="bg-surface-container-low dark:bg-surface rounded-2xl p-4 opacity-60">
          <View className="flex-row justify-center items-center mb-4">
            <View className="bg-primary-500/10 rounded-full px-4 py-2">
              <Button label="Upgrade to Pro" onPress={() => {}} variant="primary" />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={`gap-1 ${className}`}>
      <View className="flex-row gap-1">
        <Button label="(" onPress={() => onParenthesis('(')} variant="function" />
        <Button label=")" onPress={() => onParenthesis(')')} variant="function" />
        <Button label="π" onPress={onInputPi} variant="function" />
        <Button label="e" onPress={onInputE} variant="function" />
      </View>
      {SCIENTIFIC_FUNCTIONS.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-1">
          {row.map(({ label, fn }) => (
            <View key={label} className="flex-1">
              <Button label={label} onPress={() => onFunction(fn)} variant="function" />
            </View>
          ))}
        </View>
      ))}
      <View className="flex-row gap-1">
        <Button label="xⁿ" onPress={onPower} variant="function" />
        <Button label="1/x" onPress={onReciprocal} variant="function" />
      </View>
    </View>
  );
}
