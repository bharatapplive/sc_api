import {
    BadRequestException, Body, Controller, Delete, Get, HttpCode,
    Param, Post, Query, Req, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    // POST /posts — form-data: "text" aur/ya "image"
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
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
    create(@Req() req: any, @Body('text') text: string, @UploadedFile() file?: Express.Multer.File) {
        const cleanText = (text ?? '').trim();
        if (!cleanText && !file) throw new BadRequestException('Write something or add a photo');
        if (cleanText.length > 2000) throw new BadRequestException('Post is too long');
        return this.postsService.create(req.user.sub, cleanText, file ? `/uploads/${file.filename}` : '');
    }

    // GET /posts?page=1&limit=10 — feed
    @Get()
    feed(@Query('page') page = '1', @Query('limit') limit = '10') {
        const p = Math.max(1, parseInt(page) || 1);
        const l = Math.min(50, Math.max(1, parseInt(limit) || 10)); // ek baar mein max 50
        return this.postsService.findFeed(p, l);
    }

    // POST /posts/:id/like — like / unlike
    @Post(':id/like')
    @HttpCode(200)
    like(@Param('id') id: string, @Req() req: any) {
        return this.postsService.toggleLike(id, req.user.sub);
    }

    // DELETE /posts/:id — sirf apni post
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.postsService.remove(id, req.user.sub);
    }
}