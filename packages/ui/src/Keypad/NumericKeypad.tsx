import React from 'react';
import { View } from 'react-native';
import { Button } from '../Button';
import type { Operator } from '@omnicalc/core-math';

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onOperator: (op: Operator) => void;
  onEquals: () => void;
  className?: string;
}

export function NumericKeypad({
  onDigit,
  onDecimal,
  onClear,
  onToggleSign,
  onPercentage,
  onOperator,
  onEquals,
  className = '',
}: NumericKeypadProps): React.ReactElement {
  return (
    <View className={`gap-3 ${className}`}>
      <View className="flex-row gap-3">
        <Button label="C" onPress={onClear} variant="function" />
        <Button label="±" onPress={onToggleSign} variant="function" />
        <Button label="%" onPress={onPercentage} variant="function" />
        <Button label="÷" onPress={() => onOperator('/')} variant="operator" />
      </View>
      <View className="flex-row gap-3">
        <Button label="7" onPress={() => onDigit('7')} variant="secondary" />
        <Button label="8" onPress={() => onDigit('8')} variant="secondary" />
        <Button label="9" onPress={() => onDigit('9')} variant="secondary" />
        <Button label="×" onPress={() => onOperator('*')} variant="operator" />
      </View>
      <View className="flex-row gap-3">
        <Button label="4" onPress={() => onDigit('4')} variant="secondary" />
        <Button label="5" onPress={() => onDigit('5')} variant="secondary" />
        <Button label="6" onPress={() => onDigit('6')} variant="secondary" />
        <Button label="−" onPress={() => onOperator('-')} variant="operator" />
      </View>
      <View className="flex-row gap-3">
        <Button label="1" onPress={() => onDigit('1')} variant="secondary" />
        <Button label="2" onPress={() => onDigit('2')} variant="secondary" />
        <Button label="3" onPress={() => onDigit('3')} variant="secondary" />
        <Button label="+" onPress={() => onOperator('+')} variant="operator" />
      </View>
      <View className="flex-row gap-3">
        <View className="flex-[2]">
          <Button label="0" onPress={() => onDigit('0')} variant="secondary" className="h-full" />
        </View>
        <Button label="." onPress={onDecimal} variant="secondary" />
        <Button label="=" onPress={onEquals} variant="operator" />
      </View>
    </View>
  );
}
