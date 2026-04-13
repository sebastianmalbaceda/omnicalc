import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Req,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: Record<string, unknown>;
}

@Controller('calculations')
@UseGuards(JwtAuthGuard)
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCalculationDto, @Req() req: AuthenticatedRequest) {
    return this.calculationsService.create(req.user.id as string, dto);
  }

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.calculationsService.findAll(
      req.user.id as string,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 100,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearAll(@Req() req: AuthenticatedRequest) {
    await this.calculationsService.clearAll(req.user.id as string);
    return { success: true };
  }
}
