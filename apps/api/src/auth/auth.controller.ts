import { Controller, All, Req, Res } from '@nestjs/common';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All('*')
  async handleAuth(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    await this.authService.proxyToAuthHandler(req, res);
  }
}
