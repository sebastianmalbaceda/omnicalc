/**
 * @omnicalc/shared-types
 *
 * Shared Zod schemas and TypeScript types used across all apps and packages.
 * This is the single source of truth for API contracts, validation, and type definitions.
 */

export {
  signInSchema,
  signUpSchema,
  userSchema,
  calculationCreateSchema,
  calculationSchema,
  calculationsResponseSchema,
  userSettingsSchema,
  updateSettingsSchema,
  checkoutCreateSchema,
  checkoutResponseSchema,
  stripeWebhookSchema,
  apiErrorSchema,
  apiSuccessSchema,
} from './schemas.js';

export type {
  SignInInput,
  SignUpInput,
  User,
  CalculationCreateInput,
  Calculation,
  CalculationsResponse,
  UserSettings,
  UpdateSettingsInput,
  CheckoutCreateInput,
  CheckoutResponse,
  StripeWebhookEvent,
  ApiError,
} from './schemas.js';

export type {
  AppEnv,
  PaginatedResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  DeviceOrigin,
  PlanType,
  ThemeType,
  AngleUnit,
  SubscriptionProvider,
} from './types.js';
