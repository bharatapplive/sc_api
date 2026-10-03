import {
    BadRequestException, Body, Controller, Delete, Get,
    Param, Post, Req, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
    constructor(private storiesService: StoriesService) { }

    // POST /stories — form-data: "image" (zaruri), "caption" (optional)
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
    create(@Req() req: any, @Body('caption') caption: string, @UploadedFile() file?: Express.Multer.File) {
        if (!file) throw new BadRequestException('A story needs a photo');
        const cleanCaption = (caption ?? '').trim().slice(0, 200);
        return this.storiesService.create(req.user.sub, `/uploads/${file.filename}`, cleanCaption);
    }

    // GET /stories
    @Get()
    findAll() {
        return this.storiesService.findActiveGrouped();
    }

    // DELETE /stories/:id
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.storiesService.remove(id, req.user.sub);
    }
}