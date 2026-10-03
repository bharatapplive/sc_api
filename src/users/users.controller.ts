import {
    BadRequestException, Body, ConflictException, Controller, Get,
    NotFoundException, Patch, Post, Query, Req, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './users.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    // GET /users?search=abc — chat ke liye users dhoondo
    @Get()
    search(@Req() req: any, @Query('search') search = '') {
        return this.usersService.search(req.user.sub, search);
    }

    @Get('me')
    async me(@Req() req: any) {
        const user = await this.usersService.findById(req.user.sub);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    @Patch('me')
    async updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
        if (dto?.userName) dto.userName = dto.userName.toLowerCase();
        try {
            const user = await this.usersService.updateProfile(req.user.sub, dto);
            if (!user) throw new NotFoundException('User not found');
            return user;
        } catch (err: any) {
            if (err?.code === 11000) throw new ConflictException('Username already taken');
            throw err;
        }
    }

    @Post('me/photo')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: './uploads',
                filename: (_req, file, cb) =>
                    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`),
            }),
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (_req, file, cb) => {
                if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
                else cb(new BadRequestException('Only image files are allowed'), false);
            },
        }),
    )
    async uploadPhoto(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('Please choose an image');
        return this.usersService.updateProfile(req.user.sub, { image: `/uploads/${file.filename}` });
    }
}