const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export interface AuthUser {
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:8081' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Sign in failed');
  }
  const data = await res.json();
  return { token: data.token, user: data.user };
}

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:8081' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Sign up failed');
  }
  const data = await res.json();
  return { token: data.token, user: data.user };
}

export async function signOut(): Promise<void> {}

export function useSession() {
  return { data: null, isLoading: false };
}
