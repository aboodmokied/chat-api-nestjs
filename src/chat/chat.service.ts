import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/schemas/Chat';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel:Model<Chat>){}

    async joinChat(senderId:string,recieverID:string){
        const roomName=[senderId,recieverID].sort().join('_');
        const count=await this.chatModel.countDocuments({room:roomName});
        if(!count){
            await this.chatModel.create({
                room:roomName,
                users:[senderId,recieverID]
            });
        }
        return roomName;
    }

    async userRooms(userId:string){
        const chats=await this.chatModel.find({users:userId});
        return  chats.map(chat=>chat.room)
    }

    async userChats(userId:string){
        return this.chatModel.find({users:userId}).populate('users','name email');
    }
}
