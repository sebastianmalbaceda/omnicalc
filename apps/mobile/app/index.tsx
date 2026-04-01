/**
 * @omnicalc/mobile — Calculator Screen
 *
 * Main calculator UI connecting to core-math via Zustand store.
 */

import React from 'react';
import { View, Pressable, Text, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Display,
  NumericKeypad,
  OperatorKeypad,
  ScientificKeypad,
  HistoryPanel,
  useTheme,
} from '@omnicalc/ui';
import { useCalculatorStore } from '../stores/useCalculatorStore';
import { useAuthStore } from '../lib/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function CalculatorScreen(): React.ReactElement {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { toggleTheme, isDark } = useTheme();

  const handleUpgradeToPro = async (): Promise<void> => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.url) {
        if (Platform.OS === 'web') {
          window.location.href = data.url;
        } else {
          await Linking.openURL(data.url);
        }
      } else {
        console.error('Checkout error:', data.error);
      }
    } catch (err) {
      console.error('Upgrade failed', err);
    }
  };

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
    <View className={`flex-1 ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#FFFFFF]'}`}>
      <View className="flex-1 p-4 gap-4">
        {/* Header with theme toggle */}
        <View className="flex-row justify-end">
          <Pressable
            onPress={toggleTheme}
            className={`${isDark ? 'bg-[#141420]' : 'bg-[#FAFAFA]'} rounded-full px-4 py-2`}
          >
            <Text className={`text-body-md ${isDark ? 'text-white' : 'text-[#505F76]'}`}>
              {isDark ? '☀️' : '🌙'}
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

        {/* History Panel */}
        <HistoryPanel
          entries={history}
          onSelectEntry={selectHistoryEntry}
          onClearHistory={clearHistory}
          onUpgradeToPro={handleUpgradeToPro}
          isPro={isPro}
          className="flex-shrink-0 max-h-48"
        />

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
            onUpgradeToPro={handleUpgradeToPro}
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
