/**
 * @omnicalc/mobile — Calculator Screen
 *
 * Main calculator UI connecting to core-math via Zustand store.
 */

import React, { useState } from 'react';
import { View, Pressable, Text, Platform, Linking, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@omnicalc/ui';
import { useCalculatorStore } from '../stores/useCalculatorStore';
import { useAuthStore, signOut } from '../lib/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function CalculatorScreen(): React.ReactElement {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { toggleTheme, isDark } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      useAuthStore.getState().setUser(null);
      router.replace('/login');
    } catch {
      // Sign out failed — non-critical
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
    clearHistory,
    selectHistoryEntry,
  } = useCalculatorStore();

  const bg = isDark ? 'bg-[#0a0a0f]' : 'bg-[#f7f9fb]';
  const surfaceLowest = isDark ? 'bg-[#141420]' : 'bg-[#ffffff]';
  const surface = isDark ? 'bg-[#0a0a0f]' : 'bg-[#f7f9fb]';
  const surfaceLow = isDark ? 'bg-[#1a1a2e]' : 'bg-[#f2f4f6]';
  const surfaceContainer = isDark ? 'bg-[#141420]' : 'bg-[#eceef0]';
  const surfaceContainerHigh = isDark ? 'bg-[#1e1e32]' : 'bg-[#e6e8ea]';
  const surfaceContainerHighest = isDark ? 'bg-[#252540]' : 'bg-[#e0e3e5]';
  const onSurface = isDark ? 'text-[#e8e8f0]' : 'text-[#191c1e]';
  const onSurfaceVariant = isDark ? 'text-[#a0a0b8]' : 'text-[#464555]';
  const primaryText = isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]';

  const calcBtnBase =
    'flex items-center justify-center rounded-xl active:scale-95 transition-all font-headline';
  const calcBtnSecondary = `${surfaceContainerHigh} ${onSurface} font-semibold`;
  const calcBtnOperator =
    'bg-gradient-to-br from-[#392cc1] to-[#534ad9] text-white font-bold shadow-lg shadow-primary/30';
  const calcBtnFunction = `${surfaceLowest} ${primaryText} font-semibold`;
  const calcBtnMemory = `${surfaceContainerHighest} ${onSurface} font-bold`;

  return (
    <View className={`flex-1 ${bg}`}>
      {/* Top Bar */}
      <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-[#392cc1] dark:text-[#c3c0ff] text-[24px]">⊞</Text>
          <Text
            className={`text-[20px] font-extrabold tracking-tighter ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'} font-headline`}
          >
            OmniCalc
          </Text>
          {isPro && (
            <View
              className={`${isDark ? 'bg-[#2f2ebe]' : 'bg-[#6063ee]'} rounded-full px-2 py-0.5 ml-1`}
            >
              <Text className="text-[9px] font-bold tracking-widest uppercase text-white">PRO</Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center gap-3">
          {user ? (
            <View>
              <Pressable
                onPress={() => setShowUserMenu(!showUserMenu)}
                className={`${isDark ? 'bg-[#1a1a2e]' : 'bg-[#eef2ff]'} rounded-full px-3 py-1.5 flex-row items-center gap-1.5`}
              >
                <Text
                  className={`text-[10px] font-bold ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'} max-w-[100px]`}
                  numberOfLines={1}
                >
                  {user.name || user.email}
                </Text>
                <Text className={`text-[10px] ${isDark ? 'text-[#a0a0b8]' : 'text-[#464555]'}`}>
                  {showUserMenu ? '▲' : '▼'}
                </Text>
              </Pressable>
              {showUserMenu && (
                <View
                  className={`absolute top-10 right-0 ${isDark ? 'bg-[#1e1e32]' : 'bg-[#ffffff]'} rounded-xl shadow-lg p-2 min-w-[140px] z-50`}
                >
                  <Pressable
                    onPress={() => {
                      setShowUserMenu(false);
                      handleSignOut();
                    }}
                    className="flex-row items-center gap-2 px-3 py-2 rounded-lg active:opacity-60"
                  >
                    <Text className="text-[12px]">🚪</Text>
                    <Text
                      className={`text-[12px] font-semibold ${isDark ? 'text-[#e8e8f0]' : 'text-[#191c1e]'}`}
                    >
                      Sign Out
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          ) : (
            <Pressable
              onPress={() => router.push('/login')}
              className={`${isDark ? 'bg-[#1a1a2e]' : 'bg-[#eef2ff]'} rounded-full px-3 py-1.5`}
            >
              <Text
                className={`text-[10px] font-bold ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'}`}
              >
                Sign In
              </Text>
            </Pressable>
          )}
          {!isPro && user && (
            <Pressable
              onPress={handleUpgradeToPro}
              className={`${isDark ? 'bg-[#1a1a2e]' : 'bg-[#eef2ff]'} rounded-full px-3 py-1`}
            >
              <Text
                className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'}`}
              >
                Go Pro
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={toggleTheme}
            className={`${surfaceContainerHigh} rounded-full w-8 h-8 items-center justify-center`}
          >
            <Text className="text-[14px]">{isDark ? '☀️' : '🌙'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Cloud Tape / History */}
      <ScrollView
        className="flex-none px-6 py-4 max-h-[180px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mb-3 opacity-50">
          <Text className={`text-[10px] font-bold tracking-widest uppercase ${primaryText}`}>
            Cloud Tape History
          </Text>
          {history.length > 0 && (
            <Pressable onPress={clearHistory}>
              <Text className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                Clear
              </Text>
            </Pressable>
          )}
        </View>
        {history.length === 0 ? (
          <View className="py-4">
            <Text className={`text-[12px] ${onSurfaceVariant}`}>No calculations yet</Text>
          </View>
        ) : (
          history
            .slice(-5)
            .reverse()
            .map((entry, idx) => (
              <Pressable
                key={entry.timestamp}
                onPress={() => selectHistoryEntry(entry)}
                className={`py-2 px-3 rounded-xl mb-2 ${idx % 2 === 0 ? surfaceLow : ''}`}
              >
                <View className="items-end">
                  <Text
                    className={`text-[11px] tracking-tight ${onSurfaceVariant}`}
                    numberOfLines={1}
                  >
                    {entry.expression}
                  </Text>
                  <Text className={`text-[16px] font-bold ${primaryText}`}>{entry.result}</Text>
                </View>
              </Pressable>
            ))
        )}
      </ScrollView>

      {/* Display */}
      <View className={`px-6 pt-2 pb-6 items-end ${surface}`}>
        <View className="items-end w-full">
          {expression ? (
            <Text className={`text-[13px] ${onSurfaceVariant} opacity-60 mb-1 tracking-wide`}>
              {expression}
            </Text>
          ) : null}
          <Text
            className={`text-[56px] font-extrabold tracking-tighter leading-none ${isError ? 'text-[#DC2626]' : onSurface}`}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {isError ? 'Error' : display}
          </Text>
        </View>
      </View>

      {/* Keypad Surface */}
      <View className={`flex-1 ${surfaceContainer} rounded-t-[40px] px-6 pt-6 pb-4`}>
        <View className="gap-3">
          {/* Row 1: C, ±, %, ÷ */}
          <View className="flex-row gap-3">
            <Pressable onPress={clear} className={`flex-1 h-14 ${calcBtnBase} ${calcBtnFunction}`}>
              <Text className={`text-[18px] font-bold ${primaryText}`}>C</Text>
            </Pressable>
            <Pressable
              onPress={toggleSign}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnFunction}`}
            >
              <Text className={`text-[18px] font-bold ${primaryText}`}>±</Text>
            </Pressable>
            <Pressable
              onPress={percentage}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnFunction}`}
            >
              <Text className={`text-[18px] font-bold ${primaryText}`}>%</Text>
            </Pressable>
            <Pressable
              onPress={() => inputOperator('/')}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`}
            >
              <Text className="text-[22px] font-bold text-white">÷</Text>
            </Pressable>
          </View>

          {/* Row 2: 7, 8, 9, × */}
          <View className="flex-row gap-3">
            {['7', '8', '9'].map((d) => (
              <Pressable
                key={d}
                onPress={() => inputDigit(d)}
                className={`flex-1 h-14 ${calcBtnBase} ${calcBtnSecondary}`}
              >
                <Text className={`text-[20px] font-bold ${onSurface}`}>{d}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => inputOperator('*')}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`}
            >
              <Text className="text-[22px] font-bold text-white">×</Text>
            </Pressable>
          </View>

          {/* Row 3: 4, 5, 6, − */}
          <View className="flex-row gap-3">
            {['4', '5', '6'].map((d) => (
              <Pressable
                key={d}
                onPress={() => inputDigit(d)}
                className={`flex-1 h-14 ${calcBtnBase} ${calcBtnSecondary}`}
              >
                <Text className={`text-[20px] font-bold ${onSurface}`}>{d}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => inputOperator('-')}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`}
            >
              <Text className="text-[22px] font-bold text-white">−</Text>
            </Pressable>
          </View>

          {/* Row 4: 1, 2, 3, + */}
          <View className="flex-row gap-3">
            {['1', '2', '3'].map((d) => (
              <Pressable
                key={d}
                onPress={() => inputDigit(d)}
                className={`flex-1 h-14 ${calcBtnBase} ${calcBtnSecondary}`}
              >
                <Text className={`text-[20px] font-bold ${onSurface}`}>{d}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => inputOperator('+')}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`}
            >
              <Text className="text-[22px] font-bold text-white">+</Text>
            </Pressable>
          </View>

          {/* Row 5: 0 (span 2), ., = */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => inputDigit('0')}
              className={`flex-[2] h-14 ${calcBtnBase} ${calcBtnSecondary}`}
            >
              <Text className={`text-[20px] font-bold ${onSurface}`}>0</Text>
            </Pressable>
            <Pressable
              onPress={() => inputDigit('.')}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnSecondary}`}
            >
              <Text className={`text-[20px] font-bold ${onSurface}`}>.</Text>
            </Pressable>
            <Pressable
              onPress={calculate}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`}
            >
              <Text className="text-[26px] font-bold text-white">=</Text>
            </Pressable>
          </View>
        </View>

        {/* Memory row */}
        <View className="flex-row gap-3 mt-4">
          <Pressable
            onPress={memoryClear}
            className={`flex-1 h-10 ${calcBtnBase} ${calcBtnMemory}`}
          >
            <Text className={`text-[12px] font-bold ${onSurface}`}>MC</Text>
          </Pressable>
          <Pressable
            onPress={memoryRecall}
            className={`flex-1 h-10 ${calcBtnBase} ${calcBtnMemory}`}
          >
            <Text className={`text-[12px] font-bold ${onSurface}`}>MR</Text>
          </Pressable>
          <Pressable onPress={memoryAdd} className={`flex-1 h-10 ${calcBtnBase} ${calcBtnMemory}`}>
            <Text className={`text-[12px] font-bold ${onSurface}`}>M+</Text>
          </Pressable>
          <Pressable onPress={backspace} className={`flex-1 h-10 ${calcBtnBase} ${calcBtnMemory}`}>
            <Text className={`text-[12px] font-bold ${onSurface}`}>⌫</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
