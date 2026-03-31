/**
 * @omnicalc/mobile — Root Layout
 *
 * Expo Router root layout with ThemeProvider and NativeWind setup.
 */

import React from 'react';
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@omnicalc/ui';
import { SafeAreaView, useColorScheme } from 'react-native';

export default function RootLayout(): React.ReactElement {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider defaultMode={colorScheme === 'dark' ? 'dark' : 'light'}>
      <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'none',
          }}
        />
      </SafeAreaView>
    </ThemeProvider>
  );
}
