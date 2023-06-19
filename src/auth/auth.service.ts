import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: AuthDto) {
    const { email, password, username, name } = dto;
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        username,
        name,
      },
    });
    return user;
  }
}
