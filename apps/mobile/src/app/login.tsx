import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore, storeToken } from '../lib/auth';
import { useTheme } from '@omnicalc/ui';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

/* ── Exact Tailwind → RN mappings ── */
const TW = {
  gray500: { light: '#6b7280', dark: '#9ca3af' },
  gray600: { light: '#4b5563', dark: '#9ca3af' },
  gray200: '#e5e7eb',
  red50: '#fef2f2',
  red900_20: 'rgba(127,29,29,0.2)',
  red600: '#dc2626',
  red400: '#f87171',
  white: '#ffffff',
  bgLight: '#f7f9fb',
  bgDark: '#0a0a0f',
  surfaceLight: '#ffffff',
  surfaceDark: '#141420',
  textLight: '#191c1e',
  textDark: '#e8e8f0',
  primary: { light: '#392cc1', dark: '#c3c0ff' },
  borderDark: '#252540',
};

export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const { isDark } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const c = (light: string, dark: string) => (isDark ? dark : light);

  const handleSubmit = async (): Promise<void> => {
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? 'sign-in/email' : 'sign-up/email';
      const body: Record<string, unknown> = isLogin
        ? { email, password }
        : { email, password, name: name || undefined };
      const res = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || (isLogin ? 'Invalid credentials' : 'Sign up failed'));
        return;
      }
      const user = data.user;
      const token = data.session?.token || data.session?.id || '';
      if (user) {
        if (token) await storeToken(token);
        setUser(user);
        if (router.canGoBack()) router.back();
        else router.replace('/');
      } else {
        setError('Unexpected response from server');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const handleSocialLogin = (provider: string): void => {
    const url = `${API_URL}/api/auth/sign-in/${provider}`;
    if (Platform.OS === 'web') window.location.href = url;
    else router.replace('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: c(TW.bgLight, TW.bgDark) }}>
      <ScrollView
        contentContainerStyle={{
          minHeight: '100%',
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingVertical: 48,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: 448, alignSelf: 'center' }}>
          {/* Back button — mb-6 = 24px */}
          <TouchableOpacity
            onPress={handleGoBack}
            style={{ marginBottom: 24, alignSelf: 'flex-start', paddingVertical: 8 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 14, color: c(TW.gray500.light, TW.gray500.dark) }}>
              ← Back to calculator
            </Text>
          </TouchableOpacity>

          {/* Centered header — text-center mb-8 = 32px */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            {/* Logo — inline-flex items-center gap-2 mb-6 = 24px */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Text style={{ fontSize: 24, color: c(TW.primary.light, TW.primary.dark) }}>⊞</Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  letterSpacing: -0.5,
                  color: c(TW.primary.light, TW.primary.dark),
                }}
              >
                OmniCalc
              </Text>
            </View>

            {/* Title — text-2xl font-bold */}
            <Text style={{ fontSize: 24, fontWeight: '700', color: c(TW.textLight, TW.textDark) }}>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </Text>

            {/* Subtitle — mt-2 = 8px, text-sm text-gray-600 dark:text-gray-400 */}
            <Text
              style={{ fontSize: 14, color: c(TW.gray600.light, TW.gray600.dark), marginTop: 8 }}
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text
                style={{ color: c(TW.primary.light, TW.primary.dark) }}
                onPress={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Text>
            </Text>
          </View>

          {/* Form — space-y-4 = gap: 16 */}
          <View style={{ gap: 16 }}>
            {error ? (
              <View
                style={{ padding: 12, borderRadius: 8, backgroundColor: c(TW.red50, TW.red900_20) }}
              >
                <Text style={{ color: c(TW.red600, TW.red400), fontSize: 14, textAlign: 'center' }}>
                  {error}
                </Text>
              </View>
            ) : null}

            {!isLogin && (
              <View style={{ gap: 4 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: '500', color: c(TW.textLight, TW.textDark) }}
                >
                  Name <Text style={{ opacity: 0.5 }}>(optional)</Text>
                </Text>
                <TextInput
                  style={{
                    width: '100%',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: c(TW.gray200, TW.borderDark),
                    backgroundColor: c(TW.surfaceLight, TW.surfaceDark),
                    color: c(TW.textLight, TW.textDark),
                    fontSize: 15,
                  }}
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  placeholderTextColor={c(TW.gray500.light, TW.gray500.dark)}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={{ gap: 4 }}>
              <Text
                style={{ fontSize: 14, fontWeight: '500', color: c(TW.textLight, TW.textDark) }}
              >
                Email
              </Text>
              <TextInput
                style={{
                  width: '100%',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: c(TW.gray200, TW.borderDark),
                  backgroundColor: c(TW.surfaceLight, TW.surfaceDark),
                  color: c(TW.textLight, TW.textDark),
                  fontSize: 15,
                }}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={c(TW.gray500.light, TW.gray500.dark)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={{ gap: 4 }}>
              <Text
                style={{ fontSize: 14, fontWeight: '500', color: c(TW.textLight, TW.textDark) }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  width: '100%',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: c(TW.gray200, TW.borderDark),
                  backgroundColor: c(TW.surfaceLight, TW.surfaceDark),
                  color: c(TW.textLight, TW.textDark),
                  fontSize: 15,
                }}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={c(TW.gray500.light, TW.gray500.dark)}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            {/* Submit — py-3 = 12px, rounded-full */}
            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 12,
                borderRadius: 9999,
                backgroundColor: c(TW.primary.light, TW.primary.dark),
                alignItems: 'center',
                opacity: loading ? 0.5 : 1,
              }}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider — mt-6 = 24px */}
          <View style={{ marginTop: 24, position: 'relative', alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                borderTopWidth: 1,
                borderColor: c(TW.gray200, TW.borderDark),
              }}
            />
            <View
              style={{
                position: 'absolute',
                paddingHorizontal: 8,
                backgroundColor: c(TW.bgLight, TW.bgDark),
              }}
            >
              <Text style={{ fontSize: 14, color: c(TW.gray500.light, TW.gray500.dark) }}>
                Or continue with
              </Text>
            </View>
          </View>

          {/* Social buttons — mt-6 = 24px, gap-3 = 12px */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: c(TW.gray200, TW.borderDark),
                borderRadius: 8,
                backgroundColor: c(TW.surfaceLight, TW.surfaceDark),
              }}
              onPress={() => handleSocialLogin('google')}
              activeOpacity={0.7}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '500', color: c(TW.textLight, TW.textDark) }}
              >
                Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: c(TW.gray200, TW.borderDark),
                borderRadius: 8,
                backgroundColor: c(TW.surfaceLight, TW.surfaceDark),
              }}
              onPress={() => handleSocialLogin('github')}
              activeOpacity={0.7}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '500', color: c(TW.textLight, TW.textDark) }}
              >
                GitHub
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
