---
name: create-api-endpoint
description: |
  Trigger when: creating a new API route in apps/web/src/routes/,
  modifying existing endpoints, or adding new webhook handlers.
  Do NOT trigger for: frontend-only changes, database schema changes
  (use database-migration skill), or documentation updates.
---

# Create API Endpoint — OmniCalc

## Framework

- **Backend:** Hono 4
- **Location:** `apps/web/src/routes/`
- **Validation:** Zod
- **Auth:** Better Auth middleware

## Route File Template

```typescript
import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { db } from '@omnicalc/db';

const app = new Hono();

// Input validation schema
const createCalculationSchema = z.object({
  expression: z.string().min(1).max(500),
  result: z.string().min(1).max(100),
  deviceOrigin: z.enum(['web', 'ios', 'android', 'desktop']),
});

// Protected route — requires auth + Pro plan
app.post(
  '/calculations',
  authMiddleware, // Validates session
  zValidator('json', createCalculationSchema),
  async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    // Check Pro status
    if (user.plan !== 'pro') {
      return c.json({ error: 'Pro plan required' }, 403);
    }

    const calculation = await db.calculation.create({
      data: {
        userId: user.id,
        expression: data.expression,
        result: data.result,
        deviceOrigin: data.deviceOrigin,
      },
    });

    return c.json(calculation, 201);
  },
);

export default app;
```

## Checklist

For every new endpoint:

- [ ] Input validation with Zod schema
- [ ] Auth middleware on protected routes
- [ ] Pro plan check where applicable
- [ ] Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Error responses follow consistent format: `{ error: string }`
- [ ] No raw SQL — use Prisma client only
- [ ] Rate limiting considered
- [ ] Update `docs/api.md` with new endpoint
- [ ] Update `SPEC.md` if this fulfills a requirement

## Error Response Format

```typescript
// Always return structured errors
return c.json({ error: 'Description of what went wrong' }, 400);

// Never expose internal errors to clients
try {
  // ... operation
} catch (error) {
  console.error(error);
  return c.json({ error: 'Internal server error' }, 500);
}
```

## Webhook Endpoints

For Stripe/RevenueCat webhooks:

- Verify webhook signature before processing
- Use idempotency keys to prevent duplicate processing
- Log all webhook events for debugging
- Return 200 immediately, process asynchronously if needed
