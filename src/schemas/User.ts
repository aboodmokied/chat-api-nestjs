import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Roles } from "src/roles/roles.enum";



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
    
    @Prop({default:[Roles.User]})
    roles:Roles[]

    @Prop({default:0})
    customId:number
};

export const UserSchema=SchemaFactory.createForClass(User);