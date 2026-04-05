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

export function OperatorKeypad({
  onOperator,
  onEquals,
  onMemoryAdd,
  onMemoryRecall,
  onMemoryClear,
  className = '',
}: OperatorKeypadProps): React.ReactElement {
  return (
    <View className={`gap-3 ${className}`}>
      <View className="flex-row gap-3">
        <Button label="MC" onPress={onMemoryClear} variant="memory" />
        <Button label="MR" onPress={onMemoryRecall} variant="memory" />
        <Button label="M+" onPress={onMemoryAdd} variant="memory" />
      </View>
      <View className="flex-row gap-3">
        <Button label="+" onPress={() => onOperator('+')} variant="operator" />
        <Button label="−" onPress={() => onOperator('-')} variant="operator" />
      </View>
      <View className="flex-row gap-3">
        <Button label="×" onPress={() => onOperator('*')} variant="operator" />
        <Button label="÷" onPress={() => onOperator('/')} variant="operator" />
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button label="=" onPress={onEquals} variant="operator" />
        </View>
      </View>
    </View>
  );
}
