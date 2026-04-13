import { Module } from '@nestjs/common';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CalculationsController],
  providers: [CalculationsService],
  exports: [CalculationsService],
})
export class CalculationsModule {}
