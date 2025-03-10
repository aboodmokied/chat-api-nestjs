import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthorizedSoket } from "src/types";

export const ChatMemberGuard=(usersChats)=>{
    @Injectable()
    class ChatMemberGuard implements CanActivate{
        canActivate(context: ExecutionContext): boolean {
            const client:AuthorizedSoket=context.switchToWs().getClient();
            const data=context.switchToWs().getData();
            const userChats=usersChats.get(client.userId);
            if(!userChats || !userChats.has(data.chatId)){
                console.log('You are not a member in this chat');
                return false;
                // throw new ForbiddenException('You are not a member in this chat')
            }
            return true;
        }
    };
    return ChatMemberGuard;
}
