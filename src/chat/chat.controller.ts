import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';
import { JoinChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private chatService:ChatService){}

    
}
