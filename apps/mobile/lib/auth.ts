import { create } from 'zustand';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

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

export const signIn = {
  email: async (params: { email: string; password: string }): Promise<{ user: AuthUser }> => {
    const res = await fetch(`${API_URL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
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
      credentials: 'include',
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
    credentials: 'include',
  });
}

export async function getSession(): Promise<{ user: AuthUser | null } | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/session`, {
      credentials: 'include',
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (!data.user) {
      return null;
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
