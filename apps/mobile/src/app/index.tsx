/**
 * @omnicalc/mobile — Calculator Screen
 *
 * Identical layout to web-app and desktop.
 */

import React from 'react';
import { View, Pressable, Text, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@omnicalc/ui';
import { useCalculatorStore } from '../stores/useCalculatorStore';
import { useAuthStore, signOut } from '../lib/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function CalculatorScreen(): React.ReactElement {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toggleTheme, isDark } = useTheme();

  const {
    display,
    expression,
    isError,
    history,
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

  const handleUpgradeToPro = async (): Promise<void> => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) {
        if (Platform.OS === 'web') window.location.href = data.url;
      }
    } catch {
      /* non-critical */
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      useAuthStore.getState().setUser(null);
    } catch {
      /* non-critical */
    }
  };

  const planLabel = user?.plan === 'pro' ? 'PRO' : 'FREE';

  /* ── Color tokens (match web-app exactly) ── */
  const bg = isDark ? '#0a0a0f' : '#f7f9fb';
  const surfaceContainer = isDark ? '#1a1a2e' : '#eceef0';
  const surfaceContainerHigh = isDark ? '#1e1e32' : '#e6e8ea';
  const surfaceContainerHighest = isDark ? '#252540' : '#e0e3e5';
  const surfaceLowest = isDark ? '#141420' : '#ffffff';
  const onSurface = isDark ? '#e8e8f0' : '#191c1e';
  const onSurfaceVariant = isDark ? '#a0a0b8' : '#464555';
  const primaryText = isDark ? '#c3c0ff' : '#392cc1';
  const surfaceLow = isDark ? '#1a1a2e' : '#f2f4f6';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* ── Top Bar ── */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: Platform.OS === 'web' ? 16 : 48,
          paddingBottom: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 24, color: '#392cc1' }}>⊞</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', letterSpacing: -1, color: primaryText }}>
            OmniCalc
          </Text>
          <View
            style={{
              backgroundColor: '#6063ee',
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 2,
              marginLeft: 4,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: '700',
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              {planLabel}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <Text
                style={{ fontSize: 10, fontWeight: '700', color: primaryText, maxWidth: 80 }}
                numberOfLines={1}
              >
                {user.name || user.email}
              </Text>
              {user.plan !== 'pro' && (
                <Pressable onPress={handleUpgradeToPro}>
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: '700',
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      color: primaryText,
                    }}
                  >
                    Go Pro
                  </Text>
                </Pressable>
              )}
              <Pressable onPress={handleSignOut}>
                <Text style={{ fontSize: 10, fontWeight: '600', color: '#ef4444' }}>Sign Out</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={handleUpgradeToPro}>
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '700',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: primaryText,
                  }}
                >
                  Go Pro
                </Text>
              </Pressable>
              <Pressable onPress={() => router.push('/login')}>
                <Text style={{ fontSize: 10, fontWeight: '600', color: primaryText }}>Sign In</Text>
              </Pressable>
            </>
          )}
          <Pressable
            onPress={toggleTheme}
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              backgroundColor: surfaceContainerHigh,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 14 }}>{isDark ? '☀️' : '🌙'}</Text>
          </Pressable>
        </View>
      </View>

      {/* ── History ── */}
      <View style={{ maxHeight: 180, paddingHorizontal: 24, paddingVertical: 16 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
              opacity: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '700',
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: primaryText,
              }}
            >
              Cloud Tape History
            </Text>
            {history.length > 0 && (
              <Pressable onPress={clearHistory}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: '#ba1a1a',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  Clear
                </Text>
              </Pressable>
            )}
          </View>
          {history.length === 0 ? (
            <Text style={{ fontSize: 12, color: onSurfaceVariant }}>No calculations yet</Text>
          ) : (
            history
              .slice(-5)
              .reverse()
              .map((entry, idx) => (
                <Pressable
                  key={entry.timestamp}
                  onPress={() => selectHistoryEntry(entry)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    marginBottom: 8,
                    alignItems: 'flex-end',
                    backgroundColor: idx % 2 === 0 ? surfaceLow : 'transparent',
                  }}
                >
                  <Text
                    style={{ fontSize: 11, letterSpacing: -0.5, color: onSurfaceVariant }}
                    numberOfLines={1}
                  >
                    {entry.expression}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: primaryText }}>
                    {entry.result}
                  </Text>
                </Pressable>
              ))
          )}
        </ScrollView>
      </View>

      {/* ── Display ── */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 24,
          alignItems: 'flex-end',
        }}
      >
        {expression ? (
          <Text
            style={{
              fontSize: 13,
              color: onSurfaceVariant,
              opacity: 0.6,
              marginBottom: 4,
              letterSpacing: 1,
            }}
          >
            {expression}
          </Text>
        ) : null}
        <Text
          style={{
            fontSize: 56,
            fontWeight: '800',
            letterSpacing: -2,
            lineHeight: 56,
            color: isError ? '#DC2626' : onSurface,
          }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {isError ? 'Error' : display}
        </Text>
      </View>

      {/* ── Keypad ── */}
      <View
        style={{
          flex: 1,
          backgroundColor: surfaceContainer,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 16,
        }}
      >
        <View style={{ gap: 12 }}>
          {/* Row 1: C, ±, %, ÷ */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {(['C', '±', '%'] as const).map((label) => {
              const action = label === 'C' ? clear : label === '±' ? toggleSign : percentage;
              return (
                <Pressable
                  key={label}
                  onPress={action}
                  style={{
                    flex: 1,
                    height: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    backgroundColor: surfaceLowest,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: '700', color: primaryText }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => inputOperator('/')}
              style={{
                flex: 1,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: '#392cc1',
                ...Platform.select({
                  ios: {
                    shadowColor: '#392cc1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 6,
                  },
                  default: {
                    shadowColor: '#392cc1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                }),
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff' }}>÷</Text>
            </Pressable>
          </View>

          {/* Row 2: 7, 8, 9, × */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['7', '8', '9'].map((d) => (
              <Pressable
                key={d}
                onPress={() => inputDigit(d)}
                style={{
                  flex: 1,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  backgroundColor: surfaceContainerHigh,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: '700', color: onSurface }}>{d}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => inputOperator('*')}
              style={{
                flex: 1,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: '#392cc1',
                ...Platform.select({
                  ios: {
                    shadowColor: '#392cc1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                  android: { elevation: 6 },
                  default: {
                    shadowColor: '#392cc1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                }),
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff' }}>×</Text>
            </Pressable>
          </View>

          {/* Row 3: 4, 5, 6, − */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['4', '5', '6'].map((d) => (
              <Pressable
                key={d}
                onPress={() => inputDigit(d)}
                style={{
                  flex: 1,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  backgroundColor: surfaceContainerHigh,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: '700', color: onSurface }}>{d}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => inputOperator('-')}
              style={{
                flex: 1,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: '#392cc1',
                ...Platform.select({
                  ios: {
                    shadowColor: '#392cc1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                  android: { elevation: 6 },
                  default: {
                    shadowColor: '#392cc1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                }),
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff' }}>−</Text>
            </Pressable>
          </View>

          {/* Row 4: 1, 2, 3, + */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['1', '2', '3'].map((d) => (
              <Pressable
                key={d}
                onPress={() => inputDigit(d)}
                style={{
                  flex: 1,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  backgroundColor: surfaceContainerHigh,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: '700', color: onSurface }}>{d}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => inputOperator('+')}
              style={{
                flex: 1,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: '#392cc1',
                ...Platform.select({
                  ios: {
                    shadowColor: '#392cc1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                  android: { elevation: 6 },
                  default: {
                    shadowColor: '#392cc1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                }),
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff' }}>+</Text>
            </Pressable>
          </View>

          {/* Row 5: 0 (span 2), ., = */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={() => inputDigit('0')}
              style={{
                flex: 2,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: surfaceContainerHigh,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: onSurface }}>0</Text>
            </Pressable>
            <Pressable
              onPress={() => inputDigit('.')}
              style={{
                flex: 1,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: surfaceContainerHigh,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: onSurface }}>.</Text>
            </Pressable>
            <Pressable
              onPress={calculate}
              style={{
                flex: 1,
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: '#392cc1',
              }}
            >
              <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff' }}>=</Text>
            </Pressable>
          </View>
        </View>

        {/* Memory row */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          {(
            [
              { label: 'MC', action: memoryClear },
              { label: 'MR', action: memoryRecall },
              { label: 'M+', action: memoryAdd },
              { label: '⌫', action: backspace },
            ] as const
          ).map(({ label, action }) => (
            <Pressable
              key={label}
              onPress={action}
              style={{
                flex: 1,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: surfaceContainerHighest,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: onSurface }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
