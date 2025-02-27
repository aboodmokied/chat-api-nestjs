import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel:Model<User>){}

    async findAll():Promise<User[]>{
        return this.userModel.find().exec();
    }

    async create(createUserDto:CreateUserDto):Promise<User>{
        return this.userModel.create(createUserDto);
    }

    async findByEmail(email:string):Promise<User|null>{
        const user=await this.userModel.findOne({email});
        // if(user && user.password==password){
        //     return user;
        // }
        return user;
    }
}
