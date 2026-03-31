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
import { SafeAreaView, useColorScheme, StyleSheet } from 'react-native';

export default function RootLayout(): React.ReactElement {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider defaultMode={colorScheme === 'dark' ? 'dark' : 'light'}>
      <SafeAreaView style={styles.safeArea}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
});
