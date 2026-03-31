/**
 * @omnicalc/web — Development Server
 *
 * Starts both the static file server AND API server on the same port.
 *
 * Usage:
 *   cd apps/web
 *   pnpm dev
 */

import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, statSync } from 'fs';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { auth } from './auth.js';
import { createCheckoutSession, handleStripeWebhook } from './stripe.js';
import { prisma } from '@omnicalc/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
const envPath = resolve(__dirname, '../../../.env');
config({ path: envPath });

// Paths - __dirname is apps/web/src/server, go up 3 levels to project root
const PROJECT_ROOT = resolve(__dirname, '../../../');
const MOBILE_DIST = resolve(PROJECT_ROOT, 'apps', 'mobile', 'dist');
const API_PORT = parseInt(process.env.PORT || '3001', 10);
const SERVER_PORT = 3000;

console.log('[Dev Server] Project root:', PROJECT_ROOT);
console.log('[Dev Server] Mobile dist:', MOBILE_DIST);
console.log('[Dev Server] Mobile dist exists:', existsSync(MOBILE_DIST));

// Create Hono app for API
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

// Better Auth handler
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

// Debug
app.get('/api/debug/env', (c) =>
  c.json({
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ? 'SET' : 'NOT SET',
    PORT: API_PORT,
  }),
);

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

// Stripe checkout
app.post('/api/payments/checkout', async (c) => {
  try {
    const { userId } = await c.req.json<{ userId?: string }>();
    if (!process.env.STRIPE_SECRET_KEY) {
      return c.json({ error: 'Stripe not configured' }, 503);
    }
    const session = await createCheckoutSession(userId || 'anonymous');
    return c.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
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

// Calculations
app.post('/api/calculations', async (c) => {
  try {
    const { expression, result, deviceOrigin } = await c.req.json<{
      expression: string;
      result: string;
      deviceOrigin?: string;
    }>();
    const calculation = await prisma.calculation.create({
      data: { expression, result, deviceOrigin, userId: 'anonymous' },
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

// Serve static files from mobile/dist
const mimeTypes: Record<string, string> = {
  html: 'text/html',
  js: 'application/javascript',
  mjs: 'application/javascript',
  css: 'text/css',
  png: 'image/png',
  json: 'application/json',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

async function staticHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let pathname = url.pathname;

  // Root - serve index.html
  if (pathname === '/' || pathname === '') {
    const indexPath = join(MOBILE_DIST, 'index.html');
    if (existsSync(indexPath)) {
      return new Response(readFileSync(indexPath), {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    return new Response('Mobile dist not found', { status: 404 });
  }

  // Try exact path
  let filePath = join(MOBILE_DIST, pathname);

  if (!existsSync(filePath)) {
    // Try Expo paths
    const expoPath = join(MOBILE_DIST, pathname);
    if (existsSync(expoPath)) {
      filePath = expoPath;
    }
  }

  if (existsSync(filePath)) {
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      const indexPath = join(filePath, 'index.html');
      if (existsSync(indexPath)) {
        filePath = indexPath;
      }
    }
  }

  if (existsSync(filePath)) {
    const content = readFileSync(filePath);
    const ext = filePath.split('.').pop() || 'html';
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    return new Response(content, {
      headers: { 'Content-Type': mimeType },
    });
  }

  // Fallback to mobile index.html for SPA routing
  const indexPath = join(MOBILE_DIST, 'index.html');
  if (existsSync(indexPath)) {
    return new Response(readFileSync(indexPath), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  return new Response('Not Found', { status: 404 });
}

// Main fetch handler
async function fetchHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // API routes go to Hono
  if (url.pathname.startsWith('/api/')) {
    return app.fetch(req);
  }

  // Everything else is static
  return staticHandler(req);
}

console.log(`[Dev Server] Starting on port ${SERVER_PORT}`);
console.log('[Dev Server] API available at /api/*');
console.log('[Dev Server] Static files from:', MOBILE_DIST);

serve({
  fetch: fetchHandler,
  port: SERVER_PORT,
});

console.log(`[Dev Server] Running!`);
console.log(`[Dev Server] Web App: http://localhost:${SERVER_PORT}`);
console.log(`[Dev Server] API: http://localhost:${SERVER_PORT}/api/*`);
