import { z } from 'zod';

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  emailVerified: z.boolean(),
  plan: z.enum(['free', 'pro']).default('free'),
  stripeCustomerId: z.string().nullable(),
  subscriptionStatus: z.string().nullable(),
  subscriptionProvider: z.enum(['stripe', 'revenuecat']).nullable(),
  currentPeriodEnd: z.string().nullable(),
  cancelAtPeriodEnd: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Calculation Schemas ──────────────────────────────────────────────────────

export const calculationCreateSchema = z.object({
  expression: z.string().min(1, 'Expression is required'),
  result: z.string().min(1, 'Result is required'),
  deviceOrigin: z.enum(['web', 'ios', 'android', 'desktop']).optional(),
});

export const calculationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  expression: z.string(),
  result: z.string(),
  deviceOrigin: z.string().nullable(),
  createdAt: z.string(),
});

export const calculationsResponseSchema = z.object({
  calculations: z.array(calculationSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

// ─── Settings Schemas ─────────────────────────────────────────────────────────

export const userSettingsSchema = z.object({
  userId: z.string().uuid(),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  angleUnit: z.enum(['degrees', 'radians']).default('degrees'),
  thousandsSeparator: z.boolean().default(false),
  decimalPlaces: z.number().int().min(0).max(20).default(10),
  hapticFeedback: z.boolean().default(true),
});

export const updateSettingsSchema = userSettingsSchema.partial();

// ─── Payment Schemas ──────────────────────────────────────────────────────────

export const checkoutCreateSchema = z.object({
  userId: z.string().uuid(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const checkoutResponseSchema = z.object({
  url: z.string().url(),
  sessionId: z.string(),
});

export const stripeWebhookSchema = z.object({
  type: z.enum([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
  ]),
  data: z.object({
    object: z.record(z.string(), z.unknown()),
  }),
});

// ─── API Response Schema ──────────────────────────────────────────────────────

export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  code: z.string().optional(),
});

export const apiSuccessSchema = <T extends z.ZodType>(
  data: T,
): z.ZodObject<{ data: T; message: z.ZodOptional<z.ZodString> }> =>
  z.object({
    data,
    message: z.string().optional(),
  });

// ─── Exports ──────────────────────────────────────────────────────────────────

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type User = z.infer<typeof userSchema>;
export type CalculationCreateInput = z.infer<typeof calculationCreateSchema>;
export type Calculation = z.infer<typeof calculationSchema>;
export type CalculationsResponse = z.infer<typeof calculationsResponseSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type CheckoutCreateInput = z.infer<typeof checkoutCreateSchema>;
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;
export type StripeWebhookEvent = z.infer<typeof stripeWebhookSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
