import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/schemas/Chat';
import { Message } from 'src/schemas/Message';
import { UserService } from 'src/user/user.service';
import { extractChatName } from 'src/utils/extaract-chat-name';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel:Model<Chat>,@InjectModel(Message.name) private messageModel:Model<Message>,private userSevice:UserService){}
    async joinChat(senderId:string,recieverEmail:string){
        const reciever=await this.userSevice.findByEmail(recieverEmail);
        if(reciever?._id==senderId){
            return null;
        }
        if(reciever){
            const roomName=[senderId,reciever.id].sort().join('_');
            let chat=await this.chatModel.findOne({room:roomName}).populate('users','id name email roles');
            if(!chat){
                chat=await this.chatModel.create({
                    room:roomName,
                    users:[senderId,reciever.id]
                });
                chat=await this.chatModel.findById(chat.id).populate('users','id name email roles');
            }
            const enrichedChat=extractChatName(chat,senderId);
            return {chat:enrichedChat,reciever};
        }
        return null;
    }

    async userRooms(userId:string){
        const chats=await this.chatModel.find({users:userId});
        return  chats.map(chat=>chat.room)
    }

    async getChat(chatId:string){
        return this.chatModel.findById(chatId);
    }
    async getChatUsers(chatId:string){
        return this.chatModel.findById(chatId).populate('users','_id id name email roles').select('users');
    }

    async userChats(userId:string){
        // const chats=await this.chatModel.find({users:userId}).populate('users','_id id name email roles');
        const chats = await this.chatModel
            .find({ users: userId })
            .populate('users', '_id id name email roles');

        const enrichedChats = extractChatName(chats,userId);
        return enrichedChats
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
        return this.messageModel.findById(newMessage.id).populate('sender','_id id name email roles')
        .populate('reciever','_id id name email roles');
        
    }
    async chatMessages(chatId:string,page=1,limit=50){
        return this.messageModel.find({chatId})
        .sort({timestamp:-1}) // get latest messages
        .skip((page-1) * limit) // pagination
        .limit(limit)
        .populate('sender','_id id name email roles')
        .populate('reciever','_id id name email roles');
    }

    async markAsOpenedMessage(userId:string,chatId:string,messageId:string){
        return this.messageModel.updateMany({id:messageId,reciever:userId,chatId,opened:false},{opened:true});
    }
}
