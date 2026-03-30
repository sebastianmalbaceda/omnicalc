# OmniCalc — API Reference

> **Base URL:** `https://api.omnicalc.app` (production) / `http://localhost:3001` (local)
> **Framework:** Hono 4
> **Auth:** Better Auth (Bearer token)

---

## Authentication

### Session-Based Auth (Better Auth)

All authenticated endpoints require a valid session cookie or Bearer token.

```
Authorization: Bearer <session_token>
```

### Auth Endpoints

Better Auth handles these routes automatically:

| Method | Path                       | Description                  |
| ------ | -------------------------- | ---------------------------- |
| POST   | `/api/auth/sign-up/email`  | Register with email/password |
| POST   | `/api/auth/sign-in/email`  | Login with email/password    |
| POST   | `/api/auth/sign-in/social` | OAuth login (Google, GitHub) |
| POST   | `/api/auth/sign-out`       | End session                  |
| GET    | `/api/auth/session`        | Get current session          |

---

## Calculations API

### Save Calculation

```
POST /api/calculations
```

**Auth:** Required (Pro only)

**Body:**

```json
{
  "expression": "sin(45) + 2^3",
  "result": "8.70710678118655",
  "deviceOrigin": "web"
}
```

**Response (201):**

```json
{
  "id": "calc_abc123",
  "expression": "sin(45) + 2^3",
  "result": "8.70710678118655",
  "deviceOrigin": "web",
  "createdAt": "2026-03-30T12:00:00Z"
}
```

**Errors:**

- `401` — Not authenticated
- `403` — Pro plan required

---

### List Calculations (Cloud Tape)

```
GET /api/calculations?limit=50&cursor=<cursor>
```

**Auth:** Required (Pro only)

**Query Params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | number | 50 | Max results (1-100) |
| `cursor` | string | — | Pagination cursor |
| `search` | string | — | Filter by expression |

**Response (200):**

```json
{
  "data": [
    {
      "id": "calc_abc123",
      "expression": "sin(45) + 2^3",
      "result": "8.70710678118655",
      "deviceOrigin": "web",
      "createdAt": "2026-03-30T12:00:00Z"
    }
  ],
  "nextCursor": "eyJpZCI6ImNhbGNfYWJjMTI0In0=",
  "hasMore": true
}
```

---

### Delete Calculation

```
DELETE /api/calculations/:id
```

**Auth:** Required (owner only)

**Response (204):** No content

---

## User Settings API

### Get Settings

```
GET /api/settings
```

**Auth:** Required

**Response (200):**

```json
{
  "theme": "system",
  "angleUnit": "degrees",
  "thousandsSeparator": false,
  "decimalPlaces": 10,
  "hapticFeedback": true
}
```

---

### Update Settings

```
PATCH /api/settings
```

**Auth:** Required

**Body (partial):**

```json
{
  "theme": "dark",
  "angleUnit": "radians"
}
```

---

## Subscription API

### Get Subscription Status

```
GET /api/subscription
```

**Auth:** Required

**Response (200):**

```json
{
  "plan": "pro",
  "status": "active",
  "provider": "stripe",
  "currentPeriodEnd": "2026-04-30T00:00:00Z",
  "cancelAtPeriodEnd": false
}
```

---

### Create Checkout Session (Stripe — Web/Desktop)

```
POST /api/subscription/checkout
```

**Auth:** Required

**Body:**

```json
{
  "priceId": "price_...",
  "successUrl": "https://omnicalc.app/settings?success=true",
  "cancelUrl": "https://omnicalc.app/settings?canceled=true"
}
```

**Response (200):**

```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

---

### Customer Portal (Stripe)

```
POST /api/subscription/portal
```

**Auth:** Required

**Response (200):**

```json
{
  "portalUrl": "https://billing.stripe.com/..."
}
```

---

## Webhooks

### Stripe Webhook

```
POST /api/webhooks/stripe
```

**Auth:** Stripe signature verification (`stripe-signature` header)

Handles events:

- `checkout.session.completed` — Activate Pro
- `customer.subscription.updated` — Sync status
- `customer.subscription.deleted` — Downgrade to Free
- `invoice.payment_failed` — Mark past_due

### RevenueCat Webhook

```
POST /api/webhooks/revenuecat
```

**Auth:** Webhook secret verification

Handles events:

- `INITIAL_PURCHASE` — Activate Pro
- `RENEWAL` — Extend subscription
- `CANCELLATION` — Downgrade to Free
- `EXPIRATION` — Mark expired

---

## Error Response Format

All error responses follow this structure:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning                             |
| ---- | ----------------------------------- |
| 200  | OK                                  |
| 201  | Created                             |
| 204  | No Content (successful delete)      |
| 400  | Bad Request (validation error)      |
| 401  | Unauthorized (not authenticated)    |
| 403  | Forbidden (wrong plan or not owner) |
| 404  | Not Found                           |
| 429  | Rate Limited                        |
| 500  | Internal Server Error               |

---

_Document version: 0.1.0_
