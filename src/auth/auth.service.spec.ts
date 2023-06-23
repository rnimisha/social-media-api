import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule],
      providers: [AuthService, ConfigService, JwtService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('POST auth/register', () => {
    describe('valid authdto is provided', () => {
      it('should add the new user and return token', async () => {
        const data = new AuthDto();

        const userData = {
          email: data.email,
          username: data.username,
          id: expect.any(Number),
        };

        const expected = {
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        };

        jest.spyOn(service, 'checkUniqueEmail').mockResolvedValue(true);
        jest.spyOn(service, 'checkUniqueUsername').mockResolvedValue(true);
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('' as never);

        jest
          .spyOn(prismaService.user, 'create')
          .mockResolvedValue(userData as User);
        jest.spyOn(service, 'generateToken').mockResolvedValue(expected);
        jest.spyOn(service, 'storeHashedRT').mockResolvedValue(null);

        const actual = await service.register(data);

        expect(actual).toStrictEqual(expected);
        expect(service.checkUniqueEmail).toHaveBeenCalledWith(data.email);
        expect(service.checkUniqueUsername).toHaveBeenCalledWith(data.username);
        expect(prismaService.user.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('existing emailis provided', () => {
      it('should throw email conflict error', async () => {
        const data = new AuthDto();

        jest
          .spyOn(service, 'checkUniqueEmail')
          .mockRejectedValue(new ConflictException());

        await expect(service.register(data)).rejects.toThrowError(
          ConflictException,
        );
      });
    });
  });
});
