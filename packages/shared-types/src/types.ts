/**
 * @omnicalc/shared-types — Shared TypeScript types
 *
 * These types mirror the Zod schemas and provide additional
 * utility types used across all apps and packages.
 */

export type AppEnv = 'development' | 'staging' | 'production';

export type PlanType = 'free' | 'pro';

export type ThemeType = 'light' | 'dark' | 'system';

export type AngleUnit = 'degrees' | 'radians';

export type DeviceOrigin = 'web' | 'ios' | 'android' | 'desktop';

export type SubscriptionProvider = 'stripe' | 'revenuecat';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  code?: string;
  statusCode: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}
