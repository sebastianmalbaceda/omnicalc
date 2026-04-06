import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const AUTH_TOKEN_KEY = 'omnicalc_auth_token';

console.log('[Auth] API_URL:', API_URL);

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  plan?: 'free' | 'pro';
  subscriptionStatus?: string;
}

interface SignInError {
  message: string;
}

interface SignUpError {
  message: string;
}

async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

async function storeToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // Storage error — non-critical
  }
}

async function clearStoredToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Storage error — non-critical
  }
}

function authHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const signIn = {
  email: async (params: {
    email: string;
    password: string;
  }): Promise<{ user: AuthUser; token: string }> => {
    const res = await fetch(`${API_URL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err: SignInError = await res.json();
      throw new Error(err.message || 'Sign in failed');
    }
    const data = await res.json();
    if (data.token) {
      await storeToken(data.token);
    }
    return { user: data.user, token: data.token };
  },
};

export const signUp = {
  email: async (params: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ user: AuthUser; token: string }> => {
    const res = await fetch(`${API_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err: SignUpError = await res.json();
      throw new Error(err.message || 'Sign up failed');
    }
    const data = await res.json();
    if (data.token) {
      await storeToken(data.token);
    }
    return { user: data.user, token: data.token };
  },
};

export async function signOut(): Promise<void> {
  const token = await getStoredToken();
  await fetch(`${API_URL}/api/auth/sign-out`, {
    method: 'POST',
    headers: authHeaders(token ?? undefined),
  });
  await clearStoredToken();
}

export async function getSession(): Promise<{ user: AuthUser | null } | null> {
  try {
    const token = await getStoredToken();
    const url = token
      ? `${API_URL}/api/auth/get-session?token=${token}`
      : `${API_URL}/api/auth/session`;
    const res = await fetch(url);
    if (!res.ok) {
      await clearStoredToken();
      return null;
    }
    const data = await res.json();
    if (!data.user) {
      await clearStoredToken();
      return null;
    }
    if (token) {
      await storeToken(token);
    }
    return { user: data.user as AuthUser };
  } catch {
    return null;
  }
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
