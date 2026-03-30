/**
 * @omnicalc/mobile — Calculator Screen
 *
 * Main calculator UI connecting to core-math via Zustand store.
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import {
  Display,
  NumericKeypad,
  OperatorKeypad,
  ScientificKeypad,
  HistoryPanel,
  useTheme,
} from '@omnicalc/ui';
import { useCalculatorStore } from '../stores/useCalculatorStore';

export default function CalculatorScreen(): React.ReactElement {
  const { resolvedTheme, toggleTheme } = useTheme();

  const {
    display,
    expression,
    isError,
    history,
    isPro,
    inputDigit,
    inputOperator,
    calculate,
    clear,
    backspace,
    toggleSign,
    percentage,
    memoryAdd,
    memoryRecall,
    memoryClear,
    scientificOperation,
    inputParenthesis,
    clearHistory,
    selectHistoryEntry,
  } = useCalculatorStore();

  return (
    <View className={`flex-1 bg-surface ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
      <View className="flex-1 p-4 gap-4">
        {/* Header with theme toggle */}
        <View className="flex-row justify-end">
          <Pressable
            onPress={toggleTheme}
            className="bg-surface-container-low dark:bg-surface-container rounded-full px-4 py-2"
          >
            <Text className="text-body-md text-on-surface-variant dark:text-white">
              {resolvedTheme === 'dark' ? '☀️' : '🌙'}
            </Text>
          </Pressable>
        </View>

        {/* Display */}
        <Display
          value={display}
          expression={expression}
          isError={isError}
          className="flex-shrink-0"
        />

        {/* History Panel (Pro only) */}
        {isPro && (
          <HistoryPanel
            entries={history}
            onSelectEntry={selectHistoryEntry}
            onClearHistory={clearHistory}
            isPro={isPro}
            className="flex-shrink-0 max-h-48"
          />
        )}

        {/* Keypads */}
        <View className="flex-1 gap-4">
          {/* Scientific Keypad (Pro gated) */}
          <ScientificKeypad
            onFunction={scientificOperation}
            onInputPi={() => inputDigit('π')}
            onInputE={() => inputDigit('e')}
            onPower={() => inputOperator('^')}
            onReciprocal={() => scientificOperation('reciprocal')}
            onParenthesis={inputParenthesis}
            isPro={isPro}
          />

          {/* Numeric + Operator keypads side by side */}
          <View className="flex-1 flex-row gap-4">
            <View className="flex-1">
              <NumericKeypad
                onDigit={inputDigit}
                onDecimal={() => inputDigit('.')}
                onClear={clear}
                onBackspace={backspace}
                onToggleSign={toggleSign}
                onPercentage={percentage}
              />
            </View>
            <View className="flex-1">
              <OperatorKeypad
                onOperator={inputOperator}
                onEquals={calculate}
                onMemoryAdd={memoryAdd}
                onMemoryRecall={memoryRecall}
                onMemoryClear={memoryClear}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
