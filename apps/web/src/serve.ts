import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import appModule from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root (3 levels up from apps/web/dist/)
const envPath = resolve(__dirname, '../../../.env');
console.log('[serve] Loading env from:', envPath);
config({ path: envPath });
console.log('[serve] DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');
console.log('[serve] BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL ? 'set' : 'NOT SET');

const port = Number(appModule.port || 3001);
console.log(`[Hono] Server starting on http://localhost:${port}`);

serve({
  fetch: appModule.fetch,
  port,
});
