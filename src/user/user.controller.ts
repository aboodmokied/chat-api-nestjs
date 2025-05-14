import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';

@Controller('user')
export class UserController {
constructor(private readonly userService:UserService){}
    @Get()
    async findAll(){
        return this.userService.findAll();
    }
    @Post()
    async create(@Body(new ValidationPipe({whitelist:true})) createUserDto:CreateUserDto){
        return this.userService.create(createUserDto);
    }

    @Post('by-email')
    async getUserByEmail(@Res() res:Response,@Body(new ValidationPipe({whitelist:true})) findUserByEmailDto:FindUserByEmailDto){
        const user=await this.userService.findByEmail(findUserByEmailDto.email);
        if(user){
            const {_id,email,name}=user;
            return res.status(200).send({
                _id,
                email,
                name
            })
        }
        res.sendStatus(404)
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req){
        return this.userService.getById(req.user.id)
    }
}
