import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@omnicalc/db';
import { CreateCalculationDto } from './dto/create-calculation.dto';

@Injectable()
export class CalculationsService {
  private prisma = new PrismaClient();

  async create(userId: string, dto: CreateCalculationDto) {
    return this.prisma.calculation.create({
      data: {
        userId,
        expression: dto.expression,
        result: dto.result,
        deviceOrigin: dto.deviceOrigin,
      },
    });
  }

  async findAll(userId: string, page = 1, limit = 100) {
    const skip = (page - 1) * limit;
    const [calculations, total] = await Promise.all([
      this.prisma.calculation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.calculation.count({ where: { userId } }),
    ]);

    return { calculations, total, page, limit };
  }

  async clearAll(userId: string) {
    return this.prisma.calculation.deleteMany({ where: { userId } });
  }
}
