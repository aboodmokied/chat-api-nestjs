import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto{
    @IsString()
    @IsNotEmpty()
    message:string;
    @IsString()
    @IsNotEmpty()
    chatId:string;
    @IsString()
    @IsNotEmpty()
    recieverId:string
    
}
export class JoinChatDto{
    @IsString()
    @IsNotEmpty()
    recieverEmail:string
}

export class ChatOperationsDto extends PickType(SendMessageDto,['chatId']){};