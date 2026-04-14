import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

function getInitialMode(defaultMode: ThemeMode): ThemeMode {
  if (typeof window === 'undefined') return defaultMode;
  try {
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // localStorage not available (React Native)
  }
  return defaultMode;
}

function applyThemeToDOM(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);

  // Also apply background color directly to body as fallback
  document.body.style.backgroundColor = theme === 'dark' ? '#0A0A0F' : '#FFFFFF';
}

export function ThemeProvider({
  children,
  defaultMode = 'system',
}: ThemeProviderProps): React.ReactElement {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode(defaultMode));

  const resolvedTheme = mode === 'system' ? (systemColorScheme ?? 'light') : mode;
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    applyThemeToDOM(resolvedTheme);
    try {
      localStorage.setItem('theme-mode', mode);
    } catch {
      // localStorage not available (React Native)
    }
  }, [resolvedTheme, mode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return systemColorScheme === 'dark' ? 'light' : 'dark';
    });
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
