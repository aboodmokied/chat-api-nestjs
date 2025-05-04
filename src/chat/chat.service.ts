import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { count } from 'console';
import { Model } from 'mongoose';
import { Chat } from 'src/schemas/Chat';
import { Message } from 'src/schemas/Message';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel:Model<Chat>,@InjectModel(Message.name) private messageModel:Model<Message>){}

    async joinChat(senderId:string,recieverID:string){
        const roomName=[senderId,recieverID].sort().join('_');
        let chat=await this.chatModel.findOne({room:roomName}).populate('users','id name email roles');
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
    async getChatUsers(chatId:string){
        return this.chatModel.findById(chatId).populate('users','id name email roles').select('users');
    }

    async userChats(userId:string){
        return this.chatModel.find({users:userId}).populate('users','id name email roles');
    }
    async userChatsIds(userId:string):Promise<string[]>{
        const chats=await this.chatModel.find({users:userId});
        return chats.map(chat=>chat.id as string)
    }

    async newMessage(chatId:string,message:string,senderId:string,recieverId:string){
        const newMessage=await this.messageModel.create({
            content:message,
            chatId,
            sender:senderId,
            reciever:recieverId,
        })
        return this.messageModel.findById(newMessage.id).populate('sender','id name email roles')
        .populate('reciever','id name email roles');
        
    }
    async chatMessages(chatId:string,page=1,limit=50){
        return this.messageModel.find({chatId,opened:false})
        .sort({timestamp:1}) // get oldest messages
        .skip((page-1) * limit) // pagination
        .limit(limit)
        .lean();
    }

    async markAsOpenedMessage(userId:string,chatId:string,messageId:string){
        return this.messageModel.updateMany({id:messageId,reciever:userId,chatId,opened:false},{opened:true});
    }
}
