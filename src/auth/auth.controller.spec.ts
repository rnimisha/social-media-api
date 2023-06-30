import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthDto, LoginDto } from './dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
        AccessTokenStrategy,
        RefreshTokenStrategy,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('POST auth/register', () => {
    describe('valid authdto is provided', () => {
      it('should add the new user and return token', async () => {
        const data = new AuthDto();

        const expected = {
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        };

        jest.spyOn(authService, 'register').mockResolvedValue(expected);

        const actual = await controller.register(data);

        expect(actual).toBe(expected);
        expect(authService.register).toHaveBeenCalledWith(data);
      });
    });
  });

  describe('POST auth/login', () => {
    describe('valid authdto is provided', () => {
      it('should add the new user and return token', async () => {
        const data = new LoginDto();

        const expected = {
          access_token: expect.any(String),
          refresh_token: expect.any(String),
          username: expect.any(String),
        };

        jest.spyOn(authService, 'login').mockResolvedValue(expected);

        const actual = await controller.login(data);

        expect(actual).toBe(expected);
        expect(authService.login).toHaveBeenCalledWith(data);
      });
    });
  });
});
