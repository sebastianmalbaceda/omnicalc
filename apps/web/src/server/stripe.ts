import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
});

export async function createCheckoutSession(
  userId: string,
  customerId?: string,
): Promise<{ url: string } | null> {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID || 'price_test',
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.APP_URL || 'http://localhost:3000',
      metadata: { userId },
    });
    return session.url ? { url: session.url } : null;
  } catch {
    return null;
  }
}

export async function createCustomerPortalSession(
  customerId: string,
): Promise<{ url: string } | null> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.APP_URL || 'http://localhost:3000',
    });
    return session.url ? { url: session.url } : null;
  } catch {
    return null;
  }
}

export async function handleStripeWebhook(
  payload: string,
  signature: string,
): Promise<{ success: boolean; error?: string }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  try {
    const event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[Stripe] Checkout completed for user:', session.metadata?.userId);
        break;
      }
      case 'customer.subscription.updated': {
        console.log('[Stripe] Subscription updated');
        break;
      }
      case 'customer.subscription.deleted': {
        console.log('[Stripe] Subscription cancelled');
        break;
      }
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Invalid Stripe webhook signature' };
  }
}
