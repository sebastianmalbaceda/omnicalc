import React from 'react';
import { View } from 'react-native';
import { Button } from '../Button';
import type { Operator } from '@omnicalc/core-math';

interface OperatorKeypadProps {
  onOperator: (op: Operator) => void;
  onEquals: () => void;
  onMemoryAdd: () => void;
  onMemoryRecall: () => void;
  onMemoryClear: () => void;
  className?: string;
}

const OPERATOR_ROWS: Operator[][] = [
  ['+', '-'],
  ['*', '/'],
];

export function OperatorKeypad({
  onOperator,
  onEquals,
  onMemoryAdd,
  onMemoryRecall,
  onMemoryClear,
  className = '',
}: OperatorKeypadProps): React.ReactElement {
  return (
    <View className={`gap-2 ${className}`}>
      <View className="flex-row gap-2">
        <Button label="MC" onPress={onMemoryClear} variant="memory" />
        <Button label="MR" onPress={onMemoryRecall} variant="memory" />
        <Button label="M+" onPress={onMemoryAdd} variant="memory" />
      </View>
      {OPERATOR_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-2">
          {row.map((op) => (
            <View key={op} className="flex-1">
              <Button label={op} onPress={() => onOperator(op)} variant="operator" />
            </View>
          ))}
        </View>
      ))}
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button label="=" onPress={onEquals} variant="primary" />
        </View>
      </View>
    </View>
  );
}
