import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  emailOrMobile: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
