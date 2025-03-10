import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/Chat';
import { Message, MessageSchema } from 'src/schemas/Message';

@Module({
    imports:[MongooseModule.forFeature([{name:Chat.name,schema:ChatSchema},{name:Message.name,schema:MessageSchema}])],
    controllers:[],
    providers:[ChatGateway, ChatService],
})
export class ChatModule {}
