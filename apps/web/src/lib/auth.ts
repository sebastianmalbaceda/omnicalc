import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  plan?: 'free' | 'pro';
  subscriptionStatus?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  init: () => Promise<void>;
}

async function getSession(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/get-session`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.user || null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    try {
      await fetch(`${API_URL}/api/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Non-critical
    }
    set({ user: null, isAuthenticated: false });
  },
  init: async () => {
    const user = await getSession();
    set({ user, isAuthenticated: !!user, isLoading: false });
  },
}));
