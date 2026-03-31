import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, statSync } from 'fs';
import appModule from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
const envPath = resolve(__dirname, '../../../.env');
config({ path: envPath });

// Mobile web app path - __dirname is apps/web/src/server
// Need to go up 3 levels (server -> src -> web -> apps) then into mobile/dist
const mobileDistPath = resolve(__dirname, '../../../mobile/dist');

console.log('[serve] __dirname:', __dirname);
console.log('[serve] Mobile dist path:', mobileDistPath);
console.log('[serve] Mobile dist exists:', existsSync(mobileDistPath));
console.log('[serve] Index exists:', existsSync(join(mobileDistPath, 'index.html')));

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

// Custom fetch handler for static files from mobile export
const staticFetch = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  let pathname = url.pathname;

  console.log('[serve] Request:', pathname);

  // Root path - serve index.html
  if (pathname === '/' || pathname === '') {
    const indexPath = join(mobileDistPath, 'index.html');
    console.log('[serve] Root path, checking:', indexPath);
    if (existsSync(indexPath)) {
      return new Response(readFileSync(indexPath), {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  }

  // Build full file path
  let filePath = join(mobileDistPath, pathname);
  console.log('[serve] Full path:', filePath);
  console.log('[serve] Exists:', existsSync(filePath));

  // Check if path exists
  if (existsSync(filePath)) {
    try {
      const stats = statSync(filePath);
      if (stats.isDirectory()) {
        // Try index.html inside directory
        const indexPath = join(filePath, 'index.html');
        if (existsSync(indexPath)) {
          filePath = indexPath;
        }
      }
    } catch {
      // statSync failed, continue
    }
  } else {
    // File doesn't exist - try as Expo path
    const expoPath = join(mobileDistPath, pathname);
    if (existsSync(expoPath)) {
      filePath = expoPath;
    }
  }

  // Final check if file exists
  if (existsSync(filePath)) {
    const content = readFileSync(filePath);
    const ext = filePath.split('.').pop() || 'html';
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    console.log('[serve] Serving:', filePath, 'as', mimeType);
    return new Response(content, {
      headers: { 'Content-Type': mimeType },
    });
  }

  // Fallback to mobile index.html for SPA routing
  console.log('[serve] Falling back to index.html');
  const indexPath = join(mobileDistPath, 'index.html');
  if (existsSync(indexPath)) {
    return new Response(readFileSync(indexPath), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  return new Response(
    'OmniCalc Mobile Web App not found.\n\nTo build: cd apps/mobile && npx expo export --platform web\nOr for dev: cd apps/mobile && npx expo start --web',
    { status: 404, headers: { 'Content-Type': 'text/plain' } },
  );
};

// Start API + Static server
serve({
  fetch: async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    // API routes go to the Hono app
    if (url.pathname.startsWith('/api/')) {
      return appModule.fetch(req);
    }

    // Everything else is static (mobile web app)
    return staticFetch(req);
  },
  port: 3000,
});

console.log('[serve] OmniCalc Multi-Platform Server running!');
console.log('[serve] Web App: http://localhost:3000 (serves mobile export)');
console.log('[serve] API: http://localhost:3000/api/*');
