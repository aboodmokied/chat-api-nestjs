import { Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/schemas/User';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { Roles } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req:Request){
        return this.authService.generateJwtToken(req.user as User);    
    }

    @RolesDecorator(Roles.Admin)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get('me')
    me(@Req() req:Request){
        return {user:req.user}
    }

}
