/**
 * @omnicalc/web — Stripe Service
 *
 * Stripe checkout and webhook handling for Pro subscriptions.
 */

import Stripe from 'stripe';
import { prisma } from '@omnicalc/db';

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
  });
}

export async function createCheckoutSession(userId: string, customerId?: string) {
  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : undefined,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID || 'price_1TGmTeQT2nY3kpfwiliCIv6r',
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL}/pro?success=true`,
    cancel_url: `${process.env.APP_URL}/pro?canceled=true`,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.APP_URL,
  });

  return session;
}

export async function handleStripeWebhook(
  payload: string,
  signature: string,
): Promise<{ success: boolean; error?: string }> {
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  } catch {
    return { success: false, error: `Webhook signature verification failed` };
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId && session.customer) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: session.customer as string,
            plan: 'pro',
            subscriptionStatus: 'active',
          },
        });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: subscription.status === 'active' ? 'pro' : 'free',
            subscriptionStatus: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'free',
            subscriptionStatus: 'canceled',
          },
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: 'past_due',
          },
        });
      }
      break;
    }
  }

  return { success: true };
}
