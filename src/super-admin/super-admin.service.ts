import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roles } from 'src/roles/roles.enum';
import { User } from 'src/schemas/User';

@Injectable()
export class SuperAdminService {
    constructor(@InjectModel(User.name) private userModel:Model<User>){}
    
    async getAllUsers(){
        return this.userModel.find()
    }

    async getUser(id:string){
        const user=await this.userModel.findById(id);
        if(!user){
            throw new NotFoundException('User Not Found');
        }
        return user;
    }

    async deleteUser(id:string){
        const user=await this.userModel.findById(id);
        if(!user){
            throw new NotFoundException('User Not Found');
        }
        if(user.roles.includes(Roles.Super_Admin)){
            throw new ForbiddenException('Super Admin Undeletable');
        }
        await user.deleteOne();
        return {message:'user deleted successfully'}
    }

    async assignRole(id:string,role:Roles){
        const user=await this.userModel.findByIdAndUpdate(id,{
            $addToSet:{roles:role}
        },
        {new:true}
    );
        if(!user){
            throw new NotFoundException('User Not Found');
        }
        return {message:`Role ${role} Added`,user};
    }

    async revokeRole(id:string,role:Roles){
        const user=await this.userModel.findByIdAndUpdate(id,{
            $pull:{roles:role}
        },
        {new:true}
    );
        if(!user){
            throw new NotFoundException('User Not Found');
        }
        return {message:`Role ${role} Removed`,user};
    }
}
