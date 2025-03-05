import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from 'src/schemas/Room';

@Module({
    imports:[MongooseModule.forFeature([{name:Room.name,schema:RoomSchema}])],
    controllers:[],
    providers:[ChatGateway, ChatService],
})
export class ChatModule {}
