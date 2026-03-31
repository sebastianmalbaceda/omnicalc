import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signIn, signUp, useAuthStore } from '../lib/auth';

export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface dark:bg-surface-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center p-6 min-h-screen">
          {/* Back button */}
          <View className="absolute top-4 left-4 z-10">
            <TouchableOpacity
              onPress={handleGoBack}
              className="w-12 h-12 items-center justify-center bg-surface-container-low dark:bg-surface-dark-container-low rounded-full"
            >
              <Text className="text-2xl text-on-surface dark:text-on-surface-dark">←</Text>
            </TouchableOpacity>
          </View>

          {/* Login form */}
          <View className="w-full max-w-sm">
            <Text className="text-3xl font-heading font-extrabold text-on-surface dark:text-on-surface-dark mb-2 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text className="text-center text-on-surface-variant dark:text-on-surface-dark-variant mb-8">
              {isLogin ? 'Sign in to sync your cloud tape' : 'Join the math revolution'}
            </Text>

            {error ? (
              <View className="bg-error/10 p-4 rounded-lg mb-6">
                <Text className="text-error text-center font-label">{error}</Text>
              </View>
            ) : null}

            <View className="gap-4">
              {!isLogin && (
                <TextInput
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  className="w-full px-4 py-3 bg-surface-container-low dark:bg-surface-dark-container-low border border-outline/20 rounded-xl text-on-surface dark:text-on-surface-dark"
                  placeholderTextColor="#9ca3af"
                />
              )}

              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-surface-dark-container-low border border-outline/20 rounded-xl text-on-surface dark:text-on-surface-dark"
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-surface-dark-container-low border border-outline/20 rounded-xl text-on-surface dark:text-on-surface-dark"
                placeholderTextColor="#9ca3af"
              />

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`w-full py-4 mt-2 rounded-xl items-center justify-center ${
                  loading ? 'bg-primary-400 opacity-70' : 'bg-primary-500 active:bg-primary-600'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-heading font-semibold uppercase tracking-wider">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} className="mt-6 py-3">
              <Text className="text-center text-primary-500 dark:text-primary-400 font-body">
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoBack} className="mt-4 py-3">
              <Text className="text-center text-on-surface-variant dark:text-on-surface-dark-variant font-body">
                Continue as guest →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
});
