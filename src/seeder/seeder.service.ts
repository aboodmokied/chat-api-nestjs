import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';
import * as bcrypt from 'bcryptjs';
import { Roles } from 'src/roles/roles.enum';

@Injectable()
export class SeederService {
    constructor(@InjectModel(User.name) private readonly userModel:Model<User>){}
    async #adminSeeder(){
        const count = await this.userModel.countDocuments({email:'admin@gmail.com'});
        if(!count){
            await this.userModel.create({
                email:'admin@gmail.com',
                name:'admin',
                password:bcrypt.hashSync('197508a',10),
                roles:[Roles.Admin]
            });
        }
    }
    async run(){
        await this.#adminSeeder();
    }
}
