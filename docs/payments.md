# OmniCalc — Payments Architecture

> **Web/Desktop:** Stripe
> **Mobile (iOS, Android):** RevenueCat (wraps App Store / Google Play)

---

## Pricing Model

### Free Tier

- Basic calculator (arithmetic, percentage)
- Local history (device only, no sync)
- Light/dark theme

### Pro Tier — $3.99/month or $29.99/year

- Scientific calculator (trig, log, constants)
- Cloud Tape (synced calculation history)
- Cross-device sync
- Priority support
- Early access to new features

---

## Stripe (Web & Desktop)

### Flow

```
User clicks "Upgrade"
   → POST /api/subscription/checkout
   → Redirect to Stripe Checkout
   → User completes payment
   → Stripe sends webhook (checkout.session.completed)
   → Server activates Pro in database
   → User redirected to success URL
```

### Key Objects

| Stripe Object    | OmniCalc Usage                            |
| ---------------- | ----------------------------------------- |
| Customer         | Created on first checkout, linked to User |
| Subscription     | Tracks Pro plan status                    |
| Price            | Monthly ($3.99) and Yearly ($29.99)       |
| Product          | "OmniCalc Pro"                            |
| Checkout Session | Generates payment page                    |
| Customer Portal  | Self-service billing management           |
| Webhook          | Real-time subscription status sync        |

### Environment Variables

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_YEARLY_PRICE_ID=price_...
```

### Webhook Events to Handle

| Event                           | Action                                     |
| ------------------------------- | ------------------------------------------ |
| `checkout.session.completed`    | Link Stripe Customer to User, set plan=pro |
| `customer.subscription.updated` | Sync subscription status                   |
| `customer.subscription.deleted` | Set plan=free                              |
| `invoice.payment_failed`        | Set status=past_due, notify user           |

### Idempotency

- Store `stripeCustomerId` on User to prevent duplicate customers
- Check subscription status before creating new checkout sessions
- Use webhook event IDs to prevent duplicate processing

---

## RevenueCat (Mobile)

### Why RevenueCat?

- Apple and Google require in-app purchases for digital content
- RevenueCat simplifies receipt validation and subscription management
- Single SDK for both iOS and Android
- Automatic renewal handling and grace periods

### Flow

```
User taps "Upgrade" in mobile app
   → RevenueCat SDK shows native purchase dialog
   → User completes purchase via App Store / Play Store
   → RevenueCat validates receipt
   → RevenueCat sends webhook to our server
   → Server syncs Pro status in database
   → App reflects Pro status via TanStack Query refetch
```

### Configuration

```
REVENUECAT_API_KEY=appl_...
REVENUECAT_WEBHOOK_SECRET=...
```

### Webhook Events to Handle

| Event              | Action                                 |
| ------------------ | -------------------------------------- |
| `INITIAL_PURCHASE` | Set plan=pro, store RevenueCat user ID |
| `RENEWAL`          | Extend subscription period             |
| `CANCELLATION`     | Mark cancel_at_period_end              |
| `EXPIRATION`       | Set plan=free                          |
| `BILLING_ISSUE`    | Set status=past_due                    |

### User Linking

RevenueCat users are linked to OmniCalc users via:

1. Set the RevenueCat App User ID to the OmniCalc User ID on login
2. The webhook payload includes this ID for server-side linking

---

## Unified Subscription State

Regardless of payment provider, the database stores a normalized state:

```prisma
model User {
  plan               String   @default("free")     // "free" | "pro"
  subscriptionStatus String?                        // "active" | "past_due" | "canceled" | "expired"
  subscriptionProvider String?                      // "stripe" | "revenuecat"
  stripeCustomerId   String?  @unique
  revenuecatUserId   String?  @unique
  currentPeriodEnd   DateTime?
  cancelAtPeriodEnd  Boolean  @default(false)
}
```

### Client-Side Gating

```typescript
// In Zustand store or component
const isPro = user.plan === 'pro' && user.subscriptionStatus === 'active';

// Feature gating
if (!isPro) {
  showUpgradePrompt();
  return;
}
```

### Server-Side Gating

```typescript
// In Hono middleware or route
if (user.plan !== 'pro') {
  return c.json({ error: 'Pro plan required' }, 403);
}
```

---

## Security Considerations

1. **Always gate on the server** — never trust client-side plan status alone
2. **Verify webhook signatures** — both Stripe and RevenueCat
3. **Idempotent processing** — handle duplicate webhook deliveries
4. **No price IDs in frontend** — use checkout session creation on server
5. **Test mode** — use Stripe test keys and RevenueCat sandbox in development

---

_Document version: 0.1.0_
