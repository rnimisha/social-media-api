import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
import { TokenType } from './types';
import { getCurrentUserId, getCurrentUser, Public } from '../common/decorator';
import { RefreshTokenGuard } from '../common/guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: AuthDto): Promise<TokenType> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto): Promise<TokenType> {
    return this.authService.login(dto);
  }

  @Post('logout')
  logout(@getCurrentUserId() userId: number) {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(
    @getCurrentUserId() userId: number,
    @getCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(userId, refreshToken);
  }
}
