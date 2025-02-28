import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from 'src/roles/roles.enum';
import { User } from 'src/schemas/User';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
export type AuthPayload={
    sub:number,
    name:string,
    roles:Roles[]
};

@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService,private userService:UserService){}
    async validateUser(email:string,password:string){
        const user=await this.userService.findByEmail(email);
        if(user && bcrypt.compareSync(password,user.password)){
            return user;
        }
        return null;
    }
    async generateJwtToken(user:User){
        const payload:AuthPayload={
            sub:user.id,
            name:user.name,
            roles:user.roles
        }
        const accessToken=this.jwtService.sign(payload);
        return {accessToken};
    }
}
