import { create } from 'zustand';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  plan?: 'free' | 'pro';
  subscriptionStatus?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface SignInError {
  message: string;
}

interface SignUpError {
  message: string;
}

export const signIn = {
  email: async (params: { email: string; password: string }): Promise<{ user: AuthUser }> => {
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
    return { user: data.user };
  },
};

export const signUp = {
  email: async (params: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ user: AuthUser }> => {
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
    return { user: data.user };
  },
};

export async function signOut(): Promise<void> {
  await fetch(`${API_URL}/api/auth/sign-out`, {
    method: 'POST',
  });
}

export function useSession(): { data: null; isLoading: false } {
  return { data: null, isLoading: false };
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
