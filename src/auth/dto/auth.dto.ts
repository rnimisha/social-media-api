import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;
}
