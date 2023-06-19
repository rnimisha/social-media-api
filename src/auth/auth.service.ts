import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { TokenType } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // register user to database
  async register(dto: AuthDto): Promise<TokenType> {
    const { email, password, username, name } = dto;

    const hash = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hash,
        username,
        name,
      },
      select: {
        email: true,
        username: true,
        id: true,
      },
    });

    const { access_token, refresh_token } = await this.generateToken(
      newUser.id,
      newUser.email,
      newUser.username,
    );
    await this.storeHashedRT(newUser.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  async login(dto: LoginDto): Promise<TokenType> {
    const { username, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) throw new NotFoundException('User is not registered');

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      throw new ForbiddenException('Password does not match');

    const tokens = await this.generateToken(user.id, user.email, user.username);
    await this.storeHashedRT(user.id, tokens.refresh_token);

    return tokens;
  }

  // generate refresh and access token
  async generateToken(
    id: number,
    email: string,
    username: string,
  ): Promise<TokenType> {
    const access_token = await this.jwtService.signAsync(
      {
        sub: id,
        email: email,
        username: username,
      },
      {
        secret: this.config.get('ACCESS_SECRET'),
        expiresIn: 60 * 15,
      },
    );

    const refresh_token = await this.jwtService.signAsync(
      {
        sub: id,
        email: email,
        username: username,
      },
      {
        secret: this.config.get('REFRESH_SECRET'),
        expiresIn: 60 * 15,
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }

  // store refresh token hashed to db
  async storeHashedRT(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashed,
      },
    });
  }
}
