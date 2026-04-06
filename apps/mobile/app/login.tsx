import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { signIn, signUp, useAuthStore, getSession } from '../lib/auth';
import { useTheme } from '@omnicalc/ui';
import * as WebBrowser from 'expo-web-browser';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const { height } = useWindowDimensions();
  const { isDark } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.error) {
      const errorMessages: Record<string, string> = {
        state_mismatch: 'Authentication cancelled. Please try again.',
        access_denied: 'You cancelled the sign-in request.',
        invalid_callback: 'Invalid callback URL. Please try again.',
        auth_failed: 'Authentication failed. Please try again.',
      };
      const errorMsg = params.error as string;
      setError(errorMessages[errorMsg] || 'Authentication failed. Please try again.');
    }
  }, [params.error]);

  useEffect(() => {
    async function checkOAuthCallback(): Promise<void> {
      try {
        const session = await getSession();
        if (session?.user) {
          setUser(session.user);
          router.replace('/');
        }
      } catch {
        // No session yet — user may still be completing OAuth
      }
    }
    checkOAuthCallback();
  }, []);

  // Listen for postMessage from OAuth callback popup (web only)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'oauth-success') {
        getSession().then((session) => {
          if (session?.user) {
            setUser(session.user);
            router.replace('/');
          }
        });
      } else if (event.data?.type === 'oauth-cancel') {
        setError('You cancelled the sign-in request.');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const isSmallHeight = height < 600;

  const handleSubmit = async (): Promise<void> => {
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { user } = await signIn.email({ email, password });
        setUser(user);
      } else {
        const { user } = await signUp.email({
          email,
          password,
          name: name || email.split('@')[0] || 'User',
        });
        setUser(user);
      }

      router.replace('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const bg = isDark ? '#0a0a0f' : '#f7f9fb';
  const surfaceLowest = isDark ? '#141420' : '#ffffff';
  const surfaceContainerLow = isDark ? '#1a1a2e' : '#f2f4f6';
  const onSurface = isDark ? '#e8e8f0' : '#191c1e';
  const onSurfaceVariant = isDark ? '#a0a0b8' : '#464555';
  const primary = isDark ? '#c3c0ff' : '#392cc1';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Atmospheric Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View
          style={[
            styles.atmosphericBlur,
            {
              top: '25%',
              left: -80,
              backgroundColor: isDark ? 'rgba(195,192,255,0.03)' : 'rgba(57,44,193,0.05)',
            },
          ]}
        />
        <View
          style={[
            styles.atmosphericBlur,
            {
              bottom: '25%',
              right: -80,
              backgroundColor: isDark ? 'rgba(192,193,255,0.03)' : 'rgba(70,72,212,0.05)',
            },
          ]}
        />
      </View>

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={[styles.backButtonText, { color: onSurfaceVariant }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>⊞</Text>
          <Text style={[styles.logoText, { color: primary }]}>OmniCalc</Text>
        </View>
      </View>

      {/* Login form - centered */}
      <View style={[styles.formWrapper, isSmallHeight && styles.formWrapperSmall]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formContainer, { backgroundColor: surfaceLowest }]}>
            <View style={styles.formInner}>
              <Text style={[styles.title, { color: onSurface }]}>
                {isLogin ? 'Welcome Back' : 'Create Your Account'}
              </Text>
              <Text style={[styles.subtitle, { color: onSurfaceVariant }]}>
                {isLogin
                  ? 'Please enter your details to continue your logic journey.'
                  : 'Start calculating with ethereal precision today.'}
              </Text>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                {!isLogin && (
                  <View style={styles.inputWrapper}>
                    <Text style={[styles.inputIcon, { color: onSurfaceVariant }]}>👤</Text>
                    <TextInput
                      placeholder="Full Name"
                      value={name}
                      onChangeText={setName}
                      style={[
                        styles.input,
                        { color: onSurface, backgroundColor: surfaceContainerLow },
                      ]}
                      placeholderTextColor={onSurfaceVariant}
                    />
                  </View>
                )}

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputIcon, { color: onSurfaceVariant }]}>✉</Text>
                  <TextInput
                    placeholder="name@company.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.input,
                      { color: onSurface, backgroundColor: surfaceContainerLow },
                    ]}
                    placeholderTextColor={onSurfaceVariant}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputIcon, { color: onSurfaceVariant }]}>🔒</Text>
                  <TextInput
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[
                      styles.input,
                      { color: onSurface, backgroundColor: surfaceContainerLow },
                    ]}
                    placeholderTextColor={onSurfaceVariant}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  style={[
                    styles.submitButton,
                    loading && styles.submitButtonDisabled,
                    {
                      backgroundColor: primary,
                      shadowColor: primary,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isLogin ? 'Sign In →' : 'Create Account →'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: surfaceContainerLow }]} />
                <Text style={[styles.dividerText, { color: onSurfaceVariant }]}>
                  or continue with
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: surfaceContainerLow }]} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: surfaceContainerLow }]}
                  activeOpacity={0.7}
                  onPress={async () => {
                    try {
                      const res = await fetch(`${API_URL}/api/auth/sign-in/social`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          provider: 'google',
                          callbackURL: `${API_URL}/login`,
                        }),
                      });
                      const data = await res.json();
                      if (!data.url) return;
                      if (Platform.OS === 'web') {
                        const win = window.open(
                          data.url,
                          '_blank',
                          'width=500,height=600,menubar=no,toolbar=no',
                        );
                        const poll = setInterval(async () => {
                          try {
                            if (win?.closed) {
                              clearInterval(poll);
                              const session = await getSession();
                              if (session?.user) {
                                setUser(session.user);
                                router.replace('/');
                              } else {
                                setError('You cancelled the sign-in request.');
                              }
                            }
                          } catch {
                            // Tab still loading
                          }
                        }, 500);
                      } else {
                        const result = await WebBrowser.openAuthSessionAsync(
                          data.url,
                          `${API_URL}/login`,
                        );
                        if (result.type === 'cancel' || result.type === 'dismiss') {
                          setError('You cancelled the sign-in request.');
                          return;
                        }
                        const session = await getSession();
                        if (session?.user) {
                          setUser(session.user);
                          router.replace('/');
                        }
                      }
                    } catch (err) {
                      console.error('Google OAuth error:', err);
                      setError('Failed to start Google sign-in');
                    }
                  }}
                >
                  <Text style={styles.socialIcon}>G</Text>
                  <Text style={[styles.socialText, { color: onSurface }]}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: surfaceContainerLow }]}
                  activeOpacity={0.7}
                  onPress={async () => {
                    try {
                      const res = await fetch(`${API_URL}/api/auth/sign-in/social`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          provider: 'github',
                          callbackURL: `${API_URL}/login`,
                        }),
                      });
                      const data = await res.json();
                      if (!data.url) return;
                      if (Platform.OS === 'web') {
                        const win = window.open(
                          data.url,
                          '_blank',
                          'width=500,height=600,menubar=no,toolbar=no',
                        );
                        const poll = setInterval(async () => {
                          try {
                            if (win?.closed) {
                              clearInterval(poll);
                              const session = await getSession();
                              if (session?.user) {
                                setUser(session.user);
                                router.replace('/');
                              } else {
                                setError('You cancelled the sign-in request.');
                              }
                            }
                          } catch {
                            // Tab still loading
                          }
                        }, 500);
                      } else {
                        const result = await WebBrowser.openAuthSessionAsync(
                          data.url,
                          `${API_URL}/login`,
                        );
                        if (result.type === 'cancel' || result.type === 'dismiss') {
                          setError('You cancelled the sign-in request.');
                          return;
                        }
                        const session = await getSession();
                        if (session?.user) {
                          setUser(session.user);
                          router.replace('/');
                        }
                      }
                    } catch (err) {
                      console.error('GitHub OAuth error:', err);
                      setError('Failed to start GitHub sign-in');
                    }
                  }}
                >
                  <Text style={styles.socialIcon}>⌘</Text>
                  <Text style={[styles.socialText, { color: onSurface }]}>GitHub</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setIsLogin(!isLogin)}
                style={styles.switchLink}
                activeOpacity={0.7}
              >
                <Text style={[styles.switchText, { color: onSurfaceVariant }]}>
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <Text style={[styles.switchTextBold, { color: primary }]}>
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  atmosphericBlur: {
    position: 'absolute',
    width: 384,
    height: 384,
    borderRadius: 9999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -1,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  formWrapperSmall: {
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  formInner: {
    padding: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  inputIcon: {
    fontSize: 18,
    marginLeft: 16,
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingLeft: 48,
    borderRadius: 10,
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  socialIcon: {
    fontSize: 18,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchLink: {
    marginTop: 24,
    paddingVertical: 12,
  },
  switchText: {
    fontSize: 14,
    textAlign: 'center',
  },
  switchTextBold: {
    fontSize: 14,
    fontWeight: '700',
  },
});
