import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/schemas/User';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req:Request){
        return this.authService.generateJwtToken(req.user as User);    
    }
    // @UseGuards(JwtAuthGuard)
    // @Get('me')
    // me(@Req() req:Request){
    //     return {user:req.user}
    // }

}
