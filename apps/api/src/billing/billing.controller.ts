import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  RawBodyRequest,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: Record<string, unknown>;
}

@Controller('payments')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createCheckout(@Body() dto: CreateCheckoutDto, @Req() req: AuthenticatedRequest) {
    return this.billingService.createCheckoutSession(req.user.id as string, dto.priceId);
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createPortal(@Req() req: AuthenticatedRequest) {
    return this.billingService.createCustomerPortalSession(req.user.id as string);
  }

  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody?.toString() || '';
    const result = await this.billingService.handleWebhook(rawBody, signature);

    if (!result.success) {
      return { error: 'Invalid webhook signature' };
    }

    return { received: true };
  }
}
