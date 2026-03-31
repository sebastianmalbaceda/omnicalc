import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { signIn, signUp } from '../lib/auth';

export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
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
        const { error: signInError } = await signIn.email({
          email,
          password,
        });
        if (signInError) throw new Error(signInError.message || 'Login failed');
      } else {
        const { error: signUpError } = await signUp.email({
          email,
          password,
          name: name || email.split('@')[0] || 'User',
        });
        if (signUpError) throw new Error(signUpError.message || 'Signup failed');
      }
      
      // Navigate to the main app on success
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

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark items-center justify-center p-8">
      <View className="w-full max-w-sm bg-surface-container-low dark:bg-surface-dark-container-low p-8 rounded-2xl shadow-lg border border-outline/10">
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

        <View className="space-y-4">
          {!isLogin && (
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-outline/20 rounded-xl text-on-surface dark:text-on-surface-dark font-body"
              placeholderTextColor="#9ca3af"
            />
          )}

          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-outline/20 rounded-xl text-on-surface dark:text-on-surface-dark font-body"
            placeholderTextColor="#9ca3af"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full px-4 py-3 bg-surface dark:bg-surface-dark border border-outline/20 rounded-xl text-on-surface dark:text-on-surface-dark font-body"
            placeholderTextColor="#9ca3af"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-xl items-center justify-center ${
              loading ? 'bg-primary-400 opacity-70' : 'bg-primary-500 hover:bg-primary-600 active:scale-95'
            } transition-all`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-button uppercase tracking-widest">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          className="mt-6"
        >
          <Text className="text-center text-primary-500 dark:text-primary-400 font-label">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
