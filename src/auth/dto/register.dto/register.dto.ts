import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  emailOrMobile: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
