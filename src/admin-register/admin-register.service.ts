import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminRegisterRequest } from 'src/schemas/AdminRegisterRequest';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AdminRegisterService {
    constructor(@InjectModel(AdminRegisterRequest.name) private registerRequestModel:Model<AdminRegisterRequest>,private userService:UserService){}
    async createAdminRegisterRequest(createUserDto:CreateUserDto){
        const count=await this.registerRequestModel.countDocuments({email:createUserDto.email});
        if(count){
            throw new BadRequestException('You have an registeration request already, wait for approvment')
        }
        createUserDto.password=await bcrypt.hash(createUserDto.password,10);
        await this.registerRequestModel.create(createUserDto);
        return {message:'Your registerataion request was sent, wait for approvment message'}
    }
    async approveRegisterationRequest(requestId:string){
        const request=await this.registerRequestModel.findByIdAndUpdate(requestId,{approved:true});
        if(!request){
            throw new NotFoundException('Registeration request not found')
        }
        const {email,name,password}=request;
        const newAdmin=await this.userService.createAdminDirectly({email,name,password});
        // send an email to the approved admin
        // ...
        return {message:'Registeration request approved successfully'}
    }

    getAllRequests(){
        return this.registerRequestModel.find({approved:false});
    }
}
