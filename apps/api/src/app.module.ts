import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CalculationsModule } from './calculations/calculations.module';
import { UsersModule } from './users/users.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    AuthModule,
    CalculationsModule,
    UsersModule,
    BillingModule,
  ],
})
export class AppModule {}
