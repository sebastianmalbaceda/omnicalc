/**
 * OmniCalc Unified Dev Server
 *
 * Serves BOTH:
 * - Static files from mobile/dist (SPA)
 * - API routes via Hono (auth, payments, calculations)
 *
 * Usage: cd apps/web && pnpm dev
 */

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { config } from 'dotenv';
import { resolve, join, dirname } from 'path';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@omnicalc/db';
import {
  createCheckoutSession,
  createCustomerPortalSession,
  handleStripeWebhook,
} from './stripe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../../.env') });

const PROJECT_ROOT = resolve(__dirname, '../../../../');
const MOBILE_DIST = join(PROJECT_ROOT, 'apps', 'mobile', 'dist');
const PORT = 3000;

console.log('[Server] Mobile dist:', MOBILE_DIST);
console.log('[Server] Exists:', existsSync(MOBILE_DIST));

const prisma = new PrismaClient();

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

const auth = betterAuth({
  trustedOrigins: [
    'http://localhost:8081',
    'http://localhost:19006',
    'exp://localhost:8081',
    'http://localhost:3000',
    process.env.APP_URL as string,
  ].filter(Boolean),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: Object.keys(socialProviders).length > 0 ? socialProviders : undefined,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});

const app = new Hono();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',
      'http://localhost:3001',
      'http://localhost:19006',
      'exp://localhost:8081',
      process.env.APP_URL as string,
    ].filter(Boolean),
    credentials: true,
  }),
);

app.get('/api/auth/test', (c) => c.json({ message: 'auth test endpoint works' }));
app.post('/api/auth/test', (c) => c.json({ message: 'auth test POST endpoint works' }));

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.get('/api/debug/env', (c) =>
  c.json({
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
  }),
);

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

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

const MIME = {
  html: 'text/html',
  js: 'application/javascript',
  css: 'text/css',
  png: 'image/png',
  svg: 'image/svg+xml',
  json: 'application/json',
  ico: 'image/x-icon',
  map: 'application/json',
};

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname.startsWith('/api/')) {
    return app.fetch(req);
  }

  if (url.pathname === '/favicon.ico') {
    const faviconPath = join(MOBILE_DIST, 'favicon.ico');
    if (existsSync(faviconPath)) {
      const content = readFileSync(faviconPath);
      return new Response(content, { headers: { 'Content-Type': 'image/x-icon' } });
    }
    return new Response('Not Found', { status: 404 });
  }

  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  let filePath = join(MOBILE_DIST, pathname);

  if (!existsSync(filePath)) {
    filePath = join(MOBILE_DIST, 'index.html');
  }

  if (!existsSync(filePath)) {
    console.log('[Server] File not found:', pathname);
    return new Response('Not Found', { status: 404 });
  }

  try {
    const content = readFileSync(filePath);
    const ext = filePath.split('.').pop() || 'html';
    const type = MIME[ext as keyof typeof MIME] || 'text/plain';

    return new Response(content, {
      headers: { 'Content-Type': type },
    });
  } catch {
    return new Response('Error reading file', { status: 500 });
  }
}

serve({
  port: PORT,
  fetch: handleRequest,
});

console.log('[Server] ============================================');
console.log('[Server] OmniCalc Unified Server');
console.log('[Server] ============================================');
console.log('[Server] App: http://localhost:' + PORT);
console.log('[Server] API: http://localhost:' + PORT + '/api/...');
console.log('[Server] ============================================');
console.log('[Server] App: http://localhost:' + PORT);
console.log('[Server] API: http://localhost:' + PORT + '/api/...');
console.log('[Server] ============================================');
