import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/Chat';
import { Message, MessageSchema } from 'src/schemas/Message';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './chat.controller';
import { User, UserSchema } from 'src/schemas/User';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Chat.name,schema:ChatSchema},
            {name:Message.name,schema:MessageSchema},
            {name:User.name,schema:UserSchema},
    ])
    ],
    controllers:[ChatController],
    providers:[ChatGateway, ChatService],
    exports:[ChatService]
})
export class ChatModule {}
