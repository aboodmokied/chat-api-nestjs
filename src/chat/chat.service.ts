import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/schemas/Room';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Room.name) private roomModel:Model<Room>){}

    async joinChat(senderId:string,recieverID:string){
        const roomName=[senderId,recieverID].sort().join('_');
        const count=await this.roomModel.countDocuments({name:roomName});
        if(!count){
            await this.roomModel.create({
                name:roomName,
                users:[senderId,recieverID]
            });
        }
        return roomName;
    }

    async userChats(userId:string){
        const rooms=await this.roomModel.find({users:userId});
        return  rooms.map(room=>room.name)
    }
}
