import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Roles } from 'src/roles/roles.enum';
import { ChatService } from 'src/chat/chat.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel:Model<User>,
        private chatService:ChatService,
        private configService:ConfigService
    ){}

    async findAll():Promise<User[]>{
        return this.userModel.find().exec();
    }


    async create(createUserDto:CreateUserDto):Promise<User>{
        const count=await this.userModel.countDocuments({email:createUserDto.email});
        if(count){
            throw new BadRequestException(['email already used'])
        }
        createUserDto.password=await bcrypt.hash(createUserDto.password,10);
        const user = await this.userModel.create(createUserDto);
        const adminUser=await this.userModel.findOne({email:this.configService.get<string>('SUPER_ADMIN_EMAIL') || 'admin@gmail.com'})
        if(adminUser){
            const {chatId}=await this.chatService.joinChat(adminUser.id,user.email);
            await this.chatService.newMessage(chatId,`Welcome ${user.name}`,adminUser.id,user.id);
        }
        return user;
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
