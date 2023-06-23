import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
import { TokenType } from './types';
import { getCurrentUserId, getCurrentUser, Public } from '../common/decorator';
import { RefreshTokenGuard } from '../common/guard';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiConflictResponse({ description: 'Email or username already registered' })
  register(@Body() dto: AuthDto): Promise<TokenType> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiNotFoundResponse({ description: 'User is not registered' })
  @ApiForbiddenResponse({ description: 'Password does not match' })
  login(@Body() dto: LoginDto): Promise<TokenType> {
    return this.authService.login(dto);
  }

  @ApiSecurity('JWT-access')
  @Post('logout')
  logout(@getCurrentUserId() userId: number) {
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
