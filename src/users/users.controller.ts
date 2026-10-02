import { Controller, Get, NotFoundException, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    // GET http://localhost:3000/users/me
    @Get('me')
    async me(@Req() req: any) {
        const user = await this.usersService.findById(req.user.sub);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}