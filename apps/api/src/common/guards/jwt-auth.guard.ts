import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    const user = await this.authService.getUserFromSession(request);
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    (request as unknown as Record<string, unknown>).user = user;
    return true;
  }
}
