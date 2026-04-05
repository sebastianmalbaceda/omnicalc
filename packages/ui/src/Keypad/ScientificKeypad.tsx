import React from 'react';
import { View } from 'react-native';
import { Button } from '../Button';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import type { ScientificFunction } from '@omnicalc/core-math';

interface ScientificKeypadProps {
  onFunction: (fn: ScientificFunction) => void;
  onInputPi: () => void;
  onInputE: () => void;
  onPower: () => void;
  onReciprocal: () => void;
  onParenthesis: (parens: '(' | ')') => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleAngleUnit: () => void;
  onUpgradeToPro: () => void;
  isPro?: boolean;
  angleUnit?: 'degrees' | 'radians';
  className?: string;
}

export function ScientificKeypad({
  onFunction,
  onInputPi,
  onInputE,
  onPower,
  onReciprocal,
  onParenthesis,
  onClear,
  onBackspace,
  onToggleAngleUnit,
  onUpgradeToPro,
  isPro = false,
  angleUnit = 'degrees',
  className = '',
}: ScientificKeypadProps): React.ReactElement {
  const { isDark } = useTheme();

  if (!isPro) {
    return (
      <View className={className}>
        <View className={`${isDark ? 'bg-[#1a1a2e]' : 'bg-[#f5f5fa]'} rounded-2xl p-4 opacity-60`}>
          <View className="flex-row justify-center items-center mb-4">
            <View
              className={`${isDark ? 'bg-[#6366f1]/10' : 'bg-[#4648d4]/10'} rounded-full px-4 py-2`}
            >
              <Button label="Upgrade to Pro" onPress={onUpgradeToPro} variant="primary" />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={`gap-3 ${className}`}>
      <View className="flex-row gap-3">
        <Button label="sin" onPress={() => onFunction('sin')} variant="function" />
        <Button label="cos" onPress={() => onFunction('cos')} variant="function" />
        <Button label="tan" onPress={() => onFunction('tan')} variant="function" />
        <Button
          label={angleUnit === 'degrees' ? 'DEG' : 'RAD'}
          onPress={onToggleAngleUnit}
          variant="function"
        />
        <Button label="AC" onPress={onClear} variant="memory" />
      </View>
      <View className="flex-row gap-3">
        <Button label="log" onPress={() => onFunction('log')} variant="function" />
        <Button label="ln" onPress={() => onFunction('ln')} variant="function" />
        <Button label="(" onPress={() => onParenthesis('(')} variant="function" />
        <Button label=")" onPress={() => onParenthesis(')')} variant="function" />
        <Button label="⌫" onPress={onBackspace} variant="memory" />
      </View>
      <View className="flex-row gap-3">
        <Button label="√" onPress={() => onFunction('sqrt')} variant="function" />
        <Button label="π" onPress={onInputPi} variant="function" />
        <Button label="e" onPress={onInputE} variant="function" />
        <Button label="xʸ" onPress={onPower} variant="function" />
        <Button label="1/x" onPress={onReciprocal} variant="function" />
      </View>
    </View>
  );
}
