---
name: create-api-endpoint
description: |
  Trigger when: creating a new API route in apps/api/src/,
  modifying existing endpoints, or adding new webhook handlers.
  Do NOT trigger for: frontend-only changes, database schema changes
  (use database-migration skill), or documentation updates.
---

# Create API Endpoint — OmniCalc

## Framework

- **Backend:** NestJS 11
- **Location:** `apps/api/src/`
- **Validation:** class-validator + class-transformer
- **Auth:** JwtAuthGuard (Better Auth session validation)

## Module Structure

Each feature module follows this pattern:

```
apps/api/src/feature-name/
├── feature-name.module.ts
├── feature-name.controller.ts
├── feature-name.service.ts
└── dto/
    ├── create-feature.dto.ts
    └── update-feature.dto.ts
```

## Controller Template

```typescript
import { Controller, Get, Post, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: Record<string, unknown>;
}

@Controller('feature-name')
@UseGuards(JwtAuthGuard)
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFeatureDto, @Req() req: AuthenticatedRequest) {
    return this.featureService.create(req.user.id as string, dto);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.featureService.findAll(req.user.id as string);
  }
}
```

## DTO Template

```typescript
import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsIn(['web', 'ios', 'android', 'desktop'])
  deviceOrigin?: string;
}
```

## Module Template

```typescript
import { Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

## Checklist

For every new endpoint:

- [ ] DTO with class-validator decorators
- [ ] Auth guard on protected routes (`@UseGuards(JwtAuthGuard)`)
- [ ] Pro plan check where applicable
- [ ] Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Error responses follow consistent format
- [ ] No raw SQL — use Prisma client only
- [ ] Register module in `apps/api/src/app.module.ts`
- [ ] Update `docs/api.md` with new endpoint
- [ ] Update `SPEC.md` if this fulfills a requirement

## Error Response Format

```typescript
// Use NestJS built-in exceptions
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Authentication required');
throw new ForbiddenException('Pro plan required');
throw new NotFoundException('Resource not found');
```

## Webhook Endpoints

For Stripe/RevenueCat webhooks:

- Do NOT use `@UseGuards(JwtAuthGuard)` on webhook endpoints
- Verify webhook signature before processing
- Use idempotency keys to prevent duplicate processing
- Log all webhook events for debugging
- Return 200 immediately
