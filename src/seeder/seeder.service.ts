import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';
import * as bcrypt from 'bcryptjs';
import { Roles } from 'src/roles/roles.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeederService {
    constructor(@InjectModel(User.name) private readonly userModel:Model<User>,private configService:ConfigService){}
    async #adminSeeder(){
        const superAdminData={
            email:this.configService.get<string>('SUPER_ADMIN_EMAIL') || 'admin@gmail.com',
            name:this.configService.get<string>('SUPER_ADMIN_NAME') || 'admin',
            password:this.configService.get<string>('SUPER_ADMIN_PASSWORD') || '123456789'
        }
        const count = await this.userModel.countDocuments({email:superAdminData.email});
        if(!count){
            await this.userModel.create({
                email:superAdminData.email,
                name:superAdminData.name,
                password:bcrypt.hashSync(superAdminData.password,10),
                roles:[Roles.Super_Admin]
            });
        }
    }
    async run(){
        await this.#adminSeeder();
    }
}
