import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    firstName!: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @Matches(/^[a-zA-Z0-9_.]{3,20}$/, {
        message: 'Username must be 3-20 characters: letters, numbers, _ or .',
    })
    userName!: string;

    @IsEmail({}, { message: 'Enter a valid email' })
    email!: string;

    @Matches(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit mobile number' })
    mobile!: string;

    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password!: string;
}

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'Enter email, mobile or username' })
    identifier!: string; // email, mobile ya username — teeno chalenge

    @IsString()
    @IsNotEmpty({ message: 'Enter your password' })
    password!: string;
}