import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(private readonly usersService: UsersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    });
  }

  async createCheckoutSession(userId: string, priceId?: string): Promise<{ url: string }> {
    const user = await this.usersService.findById(userId);

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await this.usersService.updateSubscription(userId, { stripeCustomerId: customerId });
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.WEB_APP_URL || process.env.APP_URL || 'http://localhost:3002'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.WEB_APP_URL || process.env.APP_URL || 'http://localhost:3002',
      metadata: { userId },
    });

    if (!session.url) {
      throw new BadRequestException('Failed to create checkout session');
    }

    return { url: session.url };
  }

  async createCustomerPortalSession(userId: string): Promise<{ url: string }> {
    const user = await this.usersService.findById(userId);

    if (!user.stripeCustomerId) {
      throw new BadRequestException('No Stripe customer found for user');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: process.env.WEB_APP_URL || process.env.APP_URL || 'http://localhost:3002',
    });

    return { url: session.url };
  }

  async handleWebhook(payload: string, signature: string): Promise<{ success: boolean }> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    try {
      const event = await this.stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          if (userId) {
            await this.usersService.updatePlan(userId, 'pro');
          }
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription & {
            current_period_end?: number;
          };
          const customerId = subscription.customer as string;
          const user = await this.usersService.findByStripeCustomerId(customerId);
          if (user) {
            const isActive = subscription.status === 'active' || subscription.status === 'trialing';
            const periodEnd = subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : undefined;
            await this.usersService.updateSubscription(user.id, {
              subscriptionStatus: subscription.status,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
              plan: isActive ? 'pro' : 'free',
            });
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const user = await this.usersService.findByStripeCustomerId(customerId);
          if (user) {
            await this.usersService.updateSubscription(user.id, {
              subscriptionStatus: 'canceled',
              plan: 'free',
            });
          }
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;
          const user = await this.usersService.findByStripeCustomerId(customerId);
          if (user) {
            await this.usersService.updatePlan(user.id, 'pro');
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;
          const user = await this.usersService.findByStripeCustomerId(customerId);
          if (user) {
            await this.usersService.updateSubscription(user.id, {
              subscriptionStatus: 'past_due',
            });
          }
          break;
        }
      }

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
