import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: Record<string, unknown>;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.id as string);
  }

  @Patch('me')
  async updateProfile(@Body() dto: UpdateProfileDto, @Req() req: AuthenticatedRequest) {
    return this.usersService.updateProfile(req.user.id as string, dto);
  }

  @Get('settings')
  async getSettings(@Req() req: AuthenticatedRequest) {
    return this.usersService.getSettings(req.user.id as string);
  }

  @Patch('settings')
  async updateSettings(@Body() dto: UpdateSettingsDto, @Req() req: AuthenticatedRequest) {
    return this.usersService.updateSettings(req.user.id as string, dto);
  }
}
