/**
 * @omnicalc/mobile — Auth Store
 *
 * Zustand store for authentication state.
 * Handles user session, login, logout, and Pro status.
 */

import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  plan: 'free' | 'pro';
  subscriptionStatus?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  setPro: (isPro: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/sign-in/email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          avatarUrl: data.user.avatarUrl,
          plan: data.user.plan || 'free',
          subscriptionStatus: data.user.subscriptionStatus,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/sign-out`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/session`,
        {
          credentials: 'include',
        },
      );

      if (response.ok) {
        const data = await response.json();
        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatarUrl: data.user.avatarUrl,
            plan: data.user.plan || 'free',
            subscriptionStatus: data.user.subscriptionStatus,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setPro: (isPro: boolean) => {
    const { user } = get();
    if (user) {
      set({
        user: {
          ...user,
          plan: isPro ? 'pro' : 'free',
        },
      });
    }
  },
}));
