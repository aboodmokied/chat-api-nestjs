import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./User";
import { Chat } from "./Chat";


@Schema()
export class Message extends Document {
    @Prop({required:true})
    content:string;
    @Prop({required:true,ref:Chat.name,index:true})
    chatId:string;
    @Prop({required:true,ref:User.name})
    sender:string    
    @Prop({required:true,ref:User.name})
    reciever:string 
    @Prop({default:Date.now})
    timestamp:Date 
    @Prop({default:false})
    opened:boolean 
};

export const MessageSchema=SchemaFactory.createForClass(Message);