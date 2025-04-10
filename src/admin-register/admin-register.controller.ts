import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AdminRegisterService } from './admin-register.service';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { Roles } from 'src/roles/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@Controller('admin-register')
export class AdminRegisterController {
    constructor(private readonly adminRegisterService:AdminRegisterService){}
    @Post()
    adminRegisterRequest(@Body(new ValidationPipe({whitelist:true})) createUserDto:CreateUserDto){
        return this.adminRegisterService.createAdminRegisterRequest(createUserDto);
    }

    @RolesDecorator(Roles.Super_Admin)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Post('approve')
    approveRequest(@Body('request_id') requestId:string){
        return this.adminRegisterService.approveRegisterationRequest(requestId);
    }
    
    @RolesDecorator(Roles.Super_Admin)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get()
    getRegisterRequests(){
        return this.adminRegisterService.getAllRequests();
    }
}
