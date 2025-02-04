import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum Roles{
    Admin='admin',
    User='user'
}


@Schema()
export class User extends Document {
    @Prop({required:true})
    name:string;

    @Prop({required:true,unique:true})
    email:string;

    @Prop()
    password:string

    @Prop({default:false})
    isVerified:boolean;
    
    @Prop({default:Roles.User})
    role:Roles
};

export const UserSchema=SchemaFactory.createForClass(User);