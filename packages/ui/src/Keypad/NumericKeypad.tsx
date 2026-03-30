import React from 'react';
import { View } from 'react-native';
import { Button } from '../Button';

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  className?: string;
}

const DIGIT_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
];

export function NumericKeypad({
  onDigit,
  onDecimal,
  onClear,
  onBackspace,
  onToggleSign,
  onPercentage,
  className = '',
}: NumericKeypadProps): React.ReactElement {
  return (
    <View className={`gap-2 ${className}`}>
      <View className="flex-row gap-2">
        <Button label="±" onPress={onToggleSign} variant="secondary" />
        <Button label="%" onPress={onPercentage} variant="secondary" />
        <Button label="C" onPress={onClear} variant="secondary" />
        <Button label="⌫" onPress={onBackspace} variant="secondary" />
      </View>
      {DIGIT_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-2">
          {row.map((digit) => (
            <View key={digit} className="flex-1">
              <Button label={digit} onPress={() => onDigit(digit)} variant="secondary" />
            </View>
          ))}
        </View>
      ))}
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button label="0" onPress={() => onDigit('0')} variant="secondary" />
        </View>
        <View className="flex-1">
          <Button label="." onPress={onDecimal} variant="secondary" />
        </View>
      </View>
    </View>
  );
}
