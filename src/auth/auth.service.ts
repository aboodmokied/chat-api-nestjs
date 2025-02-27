import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/schemas/User';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService,private userService:UserService){}
    async validateUser(email:string,password:string){
        const user=await this.userService.findByEmail(email);
        if(user && user.password==password){
            return user;
        }
        return null;
    }
    async generateJwtToken(user:User){
        const payload={
            sub:user.id,
            name:user.name
        }
        const accessToken=this.jwtService.sign(payload);
        return {accessToken};
    }
}
