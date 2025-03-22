import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Roles } from 'src/roles/roles.enum';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel:Model<User>){}

    async findAll():Promise<User[]>{
        return this.userModel.find().exec();
    }

    async create(createUserDto:CreateUserDto):Promise<User>{
        createUserDto.password=await bcrypt.hash(createUserDto.password,10);
        return this.userModel.create(createUserDto);
    }
    async createAdminDirectly(createUserDto:CreateUserDto):Promise<User>{
        return this.userModel.create({...createUserDto,roles:[Roles.Admin]});
    }

    async findByEmail(email:string):Promise<User|null>{
        const user=await this.userModel.findOne({email});
        // if(user && user.password==password){
        //     return user;
        // }
        return user;
    }
    async getById(id:string):Promise<User|null>{
        const user=await this.userModel.findById(id);
        return user;
    }
}
