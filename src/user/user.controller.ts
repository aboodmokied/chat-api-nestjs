import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
constructor(private readonly userService:UserService){}
    @Get()
    async findAll(){
        return this.userService.findAll();
    }
    @Post()
    async create(@Body() createUserDto:CreateUserDto){
        return this.userService.create(createUserDto);
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('me')
    // me(@Req() req:Request){
    //     return {user:req.user}
    // }
}
