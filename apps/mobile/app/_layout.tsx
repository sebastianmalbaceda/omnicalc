/**
 * @omnicalc/mobile — Root Layout
 *
 * Expo Router root layout with ThemeProvider and NativeWind setup.
 */

import React, { useEffect } from 'react';
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@omnicalc/ui';
import { SafeAreaView, useColorScheme, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useAuthStore, getSession } from '../lib/auth';

function AuthInitializer({ children }: { children: React.ReactNode }): React.ReactElement {
  const { setUser, isLoading } = useAuthStore();

  useEffect(() => {
    async function loadSession(): Promise<void> {
      console.log('[Auth] Checking session...');
      const session = await getSession();
      if (session?.user) {
        console.log('[Auth] Session found for:', session.user.email);
        setUser(session.user);
      } else {
        console.log('[Auth] No session found');
        setUser(null);
      }
    }
    loadSession();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout(): React.ReactElement {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider defaultMode={colorScheme === 'dark' ? 'dark' : 'light'}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <AuthInitializer>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'none',
            }}
          />
        </AuthInitializer>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
  },
});
