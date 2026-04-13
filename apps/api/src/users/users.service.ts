import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@omnicalc/db';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        emailVerified: true,
        plan: true,
        stripeCustomerId: true,
        subscriptionStatus: true,
        subscriptionProvider: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getSettings(userId: string) {
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }

  async updatePlan(userId: string, plan: 'free' | 'pro') {
    return this.prisma.user.update({
      where: { id: userId },
      data: { plan },
    });
  }

  async findByStripeCustomerId(stripeCustomerId: string) {
    return this.prisma.user.findUnique({
      where: { stripeCustomerId },
    });
  }

  async updateSubscription(
    userId: string,
    data: {
      stripeCustomerId?: string;
      subscriptionStatus?: string;
      subscriptionProvider?: string;
      currentPeriodEnd?: Date;
      cancelAtPeriodEnd?: boolean;
      plan?: 'free' | 'pro';
    },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
