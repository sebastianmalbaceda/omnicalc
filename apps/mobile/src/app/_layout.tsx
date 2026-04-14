/**
 * @omnicalc/mobile — Root Layout
 *
 * Expo Router root layout with ThemeProvider and NativeWind setup.
 * Calculator is always shown — auth is optional for cloud features.
 */

import React, { useEffect } from 'react';
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@omnicalc/ui';
import { SafeAreaView, useColorScheme, StyleSheet } from 'react-native';
import { useAuthStore, getSession } from '../lib/auth';

function AuthInitializer({ children }: { children: React.ReactNode }): React.ReactElement {
  const { setUser } = useAuthStore();

  useEffect(() => {
    async function loadSession(): Promise<void> {
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    }
    loadSession();
  }, [setUser]);

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
});
