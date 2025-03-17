import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { Roles } from 'src/roles/roles.enum';
import { SuperAdminService } from './super-admin.service';

@RolesDecorator(Roles.Super_Admin)
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('super-admin')
export class SuperAdminController {
    constructor(private readonly superAdminService:SuperAdminService){}
    @Get('users')
    getAllUsers(){
        return this.superAdminService.getAllUsers();
    }

    @Get('users/:user_id')
    getUser(@Param('user_id') id:string){
        return this.superAdminService.getUser(id);
    }

    @Delete('users/:user_id/delete')
    deleteUser(@Param('user_id') id:string){
        return this.superAdminService.deleteUser(id);
    }

    @Patch('users/assign-role')
    assignRole(@Body() body:{user_id:string,role:Roles}){
        return this.superAdminService.assignRole(body.user_id,body.role)
    }

    @Patch('users/revoke-role')
    revokeRole(@Body() body:{user_id:string,role:Roles}){
        return this.superAdminService.revokeRole(body.user_id,body.role)
    }
}
