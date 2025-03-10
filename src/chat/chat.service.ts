import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/schemas/Chat';
import { Message } from 'src/schemas/Message';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel:Model<Chat>,@InjectModel(Message.name) private messageModel:Model<Message>){}

    async joinChat(senderId:string,recieverID:string){
        const roomName=[senderId,recieverID].sort().join('_');
        let chat=await this.chatModel.findOne({room:roomName});
        if(!chat){
            chat=await this.chatModel.create({
                room:roomName,
                users:[senderId,recieverID]
            });
        }
        return chat;
    }

    async userRooms(userId:string){
        const chats=await this.chatModel.find({users:userId});
        return  chats.map(chat=>chat.room)
    }

    async getChat(chatId:string){
        return this.chatModel.findById(chatId);
    }

    async userChats(userId:string){
        return this.chatModel.find({users:userId}).populate('users','name email');
    }
    async userChatsIds(userId:string):Promise<string[]>{
        const chats=await this.chatModel.find({users:userId});
        return chats.map(chat=>chat.id as string)
    }

    async newMessage(chatId:string,message:string){
        return this.messageModel.create({
            content:message,
            chatId,
            sender:0,
            reciever:0,
        })
    }
    async chatMessages(chatId:string,page=1,limit=50){
        return this.messageModel.find({chatId})
        .sort({timestamp:-1}) // get latest messages
        .skip((page-1) * limit) // pagination
        .limit(limit)
        .lean();
    }

    async markAsOpenedMessages(userId:string,chatId:string){
        return this.messageModel.updateMany({reciever:userId,chatId,opened:false},{opened:true});
    }
}
