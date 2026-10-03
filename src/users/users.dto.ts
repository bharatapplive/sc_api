import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional() @IsString() @MaxLength(50)
    firstName?: string;

    @IsOptional() @IsString() @MaxLength(50)
    lastName?: string;

    @IsOptional()
    @Matches(/^[a-zA-Z0-9_.]{3,20}$/, {
        message: 'Username must be 3-20 characters: letters, numbers, _ or .',
    })
    userName?: string;

    @IsOptional() @IsString() @MaxLength(150)
    bio?: string;
}