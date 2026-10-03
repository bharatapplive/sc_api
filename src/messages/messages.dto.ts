import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
    @IsString()
    @IsNotEmpty({ message: 'Message cannot be empty' })
    @MaxLength(2000)
    text!: string;
}