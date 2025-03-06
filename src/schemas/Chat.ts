import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./User";



@Schema()
export class Chat extends Document {
    @Prop({required:true,unique:true})
    room:string;
    @Prop({required:true,ref:User.name})
    users:string[]    
};

export const ChatSchema=SchemaFactory.createForClass(Chat);