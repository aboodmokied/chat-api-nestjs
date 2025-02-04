import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}
    @Get()
    async findAll(){
        return this.userService.findAll();
    }
    @Post()
    async create(@Body(ValidationPipe) createUserDto:CreateUserDto){
        return this.userService.create(createUserDto);
    }
}
