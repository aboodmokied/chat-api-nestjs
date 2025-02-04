import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel:Model<User>){}

    async findAll():Promise<User[]>{
        return this.userModel.find().exec();
    }

    async create(createUserDto:CreateUserDto):Promise<User>{
        return this.userModel.create(createUserDto);
    }
}
