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
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthStore>>;
export {};
//# sourceMappingURL=auth.d.ts.map