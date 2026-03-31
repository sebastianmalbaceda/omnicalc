/**
 * @omnicalc/web — Hono Application
 *
 * Main API server with auth, calculations, and webhook routes.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { auth } from './auth.js';
import {
  createCheckoutSession,
  createCustomerPortalSession,
  handleStripeWebhook,
} from './stripe.js';
import { prisma } from '@omnicalc/db';
import * as fs from 'fs';
import * as path from 'path';

const app = new Hono();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',
      'http://localhost:3001',
      process.env.APP_URL as string,
    ].filter(Boolean),
    credentials: true,
  }),
);

// Serve landing page
app.get('/', (c) => {
  const htmlPath = path.join(process.cwd(), 'public', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  return c.html(html);
});

// Redirect /app to the Expo Web App port in development
app.get('/app', (c) => {
  return c.redirect(process.env.APP_URL || 'http://localhost:8081');
});

// Debug test endpoint at auth path
app.get('/api/auth/test', (c) => c.json({ message: 'auth test endpoint works' }));
app.post('/api/auth/test', (c) => c.json({ message: 'auth test POST endpoint works' }));

// Better Auth handler
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));
app.get('/api/debug/env', (c) =>
  c.json({
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
  }),
);

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

// Stripe checkout (Pro)
app.post('/api/payments/checkout', async (c) => {
  try {
    const { userId, customerId } = await c.req.json<{ userId?: string; customerId?: string }>();

    if (!process.env.STRIPE_SECRET_KEY) {
      return c.json({ error: 'Stripe not configured' }, 503);
    }

    const session = await createCheckoutSession(userId || 'anonymous', customerId);
    return c.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// Stripe customer portal
app.post('/api/payments/portal', async (c) => {
  try {
    const { customerId } = await c.req.json<{ customerId: string }>();

    if (!process.env.STRIPE_SECRET_KEY) {
      return c.json({ error: 'Stripe not configured' }, 503);
    }

    const session = await createCustomerPortalSession(customerId);
    return c.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return c.json({ error: 'Failed to create portal session' }, 500);
  }
});

// Stripe webhook
app.post('/api/webhooks/stripe', async (c) => {
  try {
    const payload = await c.req.text();
    const signature = c.req.header('stripe-signature') || '';

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return c.json({ error: 'Webhook secret not configured' }, 503);
    }

    const result = await handleStripeWebhook(payload, signature);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook handler failed' }, 500);
  }
});

// Calculations API (Pro users only)
app.post('/api/calculations', async (c) => {
  try {
    const body = await c.req.json<{ expression: string; result: string; deviceOrigin?: string }>();
    const { expression, result, deviceOrigin } = body;

    const calculation = await prisma.calculation.create({
      data: {
        expression,
        result,
        deviceOrigin,
        userId: 'anonymous',
      },
    });

    return c.json(calculation, 201);
  } catch (error) {
    console.error('Error creating calculation:', error);
    return c.json({ error: 'Failed to save calculation' }, 500);
  }
});

app.get('/api/calculations', async (c) => {
  try {
    const calculations = await prisma.calculation.findMany({
      where: { userId: 'anonymous' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return c.json(calculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return c.json({ error: 'Failed to fetch calculations' }, 500);
  }
});

app.delete('/api/calculations', async (c) => {
  try {
    await prisma.calculation.deleteMany({
      where: { userId: 'anonymous' },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting calculations:', error);
    return c.json({ error: 'Failed to delete calculations' }, 500);
  }
});

// User settings API
app.get('/api/settings', async (c) => {
  try {
    const userId = 'anonymous';

    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId },
      });
    }

    return c.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

app.patch('/api/settings', async (c) => {
  try {
    const userId = 'anonymous';
    const body = await c.req.json<{
      theme?: string;
      angleUnit?: string;
      thousandsSeparator?: boolean;
      decimalPlaces?: number;
      hapticFeedback?: boolean;
    }>();

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: body,
      create: { userId, ...body },
    });

    return c.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

export default {
  port: process.env.PORT || 3001,
  fetch: app.fetch,
};
