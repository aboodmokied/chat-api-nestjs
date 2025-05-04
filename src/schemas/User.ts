import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Roles } from "src/roles/roles.enum";



@Schema()
export class User extends Document {
    @Prop({required:true})
    name:string;

    @Prop({required:true,unique:true})
    email:string;

    @Prop({required:true})
    password:string

    // @Prop({default:false})
    // isVerified:boolean;
    
    @Prop({default:[Roles.User]})
    roles:Roles[]

};

export const UserSchema=SchemaFactory.createForClass(User);