import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthorizedSoket } from "src/types";
import { ChatService } from "./chat.service";
import { UseFilters, UseGuards, ValidationPipe } from "@nestjs/common";
import { ChatMemberGuard } from "./guards/chat-member.guard";
import { ChatOperationsDto, JoinChatDto, SendMessageDto } from "./dto/chat.dto";
import { AllExceptionsFilter } from "src/filters/all-exceptions.filter";
import { WsExceptionsFilter } from "src/filters/ws-exceptions.filter";


@WebSocketGateway({
    // namespace:'chat',
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'], // Specify allowed methods
        credentials: true, // Include credentials if needed
      },
})
@UseFilters(new WsExceptionsFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private activeUsers=new Map<string,string>(); // userId -> socketId
    static connectedUserChats=new Map<string,Set<string>>(); // userId -> [user chats Ids]

    private async updateConnectedUserChats(userId:string){
        const chatsIds=await this.chatService.userChatsIds(userId);
        ChatGateway.connectedUserChats.set(userId,new Set(chatsIds));
    }
    @WebSocketServer()
    private server:Server;
    constructor(private chatService:ChatService){}

    
    async handleConnection(client: AuthorizedSoket) {
        console.log('Client Connected:',client.id);
        await this.chatService.userChats(client.userId);
        // add it to active users
        this.activeUsers.set(client.userId,client.id);
        // add user chats to activeUserChats map
        this.updateConnectedUserChats(client.userId);
        // get its rooms
        const userRooms=await this.chatService.userRooms(client.userId); 
        // join to them
        client.join(userRooms); 
        this.server.emit('userConnected',`User Connected: ${client.id}`);
    }

    handleDisconnect(client: AuthorizedSoket) {
        this.activeUsers.delete(client.userId);
        ChatGateway.connectedUserChats.delete(client.userId);
        this.server.emit('userDisconnected',`User Disconnected: ${client.id}`);
    }

    // join a room listener
    @SubscribeMessage('joinChat')
    async handlePrivateChat(@ConnectedSocket() client:Socket,@MessageBody(new ValidationPipe({whitelist:true})) data:JoinChatDto){
        const {senderId,recieverId}=data;
        const chat=await this.chatService.joinChat(senderId,recieverId);
        // join the current user to this new chat
        client.join(chat.room);
        // update sender chats in activeUserChats map
        this.updateConnectedUserChats(senderId);
        // get the second user socket if its connected (using recieverID), and join it to this chat
        const recieverSocketId=this.activeUsers.get(recieverId);
        if(recieverSocketId){ // if the user active
            const recieverSocket=this.server.sockets.sockets.get(recieverSocketId);
            recieverSocket?.join(chat.room);
            // update reciever chats in activeUserChats map
            this.updateConnectedUserChats(recieverId);
        }
        this.server.to(chat.room).emit('newChat',{chat:chat});
    }

    // validate if the sender is a member in the chat
    @UseGuards(ChatMemberGuard(ChatGateway.connectedUserChats))
    @SubscribeMessage('privateMessage')
    async handlePrivateMessage(@ConnectedSocket() client:AuthorizedSoket,@MessageBody(new ValidationPipe({whitelist:true})) {chatId,message,recieverId}:SendMessageDto){
        const newMessage=await this.chatService.newMessage(chatId,message,client.userId,recieverId);
        const chat=await this.chatService.getChat(chatId);
        this.server.to(chat!.room).emit('newMessage',{message:newMessage,chat,recieverId});
    }

    
    @SubscribeMessage('myChats')
    async handleMyChats(client:AuthorizedSoket){
        const chats=await this.chatService.userChats(client.userId);
        this.server.to(client.id).emit('myChats',{chats});
    }
    
    // validate if the user is a member in the chat
    @UseGuards(ChatMemberGuard(ChatGateway.connectedUserChats))
    @SubscribeMessage('chatMessages')
    async handleChatMessages(client:AuthorizedSoket,{chatId,page,limit}){
        const messages=await this.chatService.chatMessages(chatId,page,limit);
        this.server.to(client.id).emit('chatMessages',{chatId,messages});
    }

    // validate if the user is a member in the chat
    @UseGuards(ChatMemberGuard(ChatGateway.connectedUserChats))
    @SubscribeMessage('chatUsers')
    async handleChatUsers(client:AuthorizedSoket,{chatId}){
        const users=await this.chatService.getChatUsers(chatId);
        this.server.to(client.id).emit('chatUsers',{users});
    }

    // // validate if the user is a member in the chat
    // // this event should emited when user opens a specific chat 
    // @UseGuards(ChatMemberGuard(ChatGateway.connectedUserChats))
    // @SubscribeMessage('chatNewMessages')
    // async handleChatNewMessages(client:AuthorizedSoket,{chatId,page,limit}){
    //     const messages=await this.chatService.chatMessages(chatId,page,limit);
    //     this.server.to(client.id).emit('chatMessages',{chatId,messages});
    // }

    // validate if the user is a member in the chat
    @UseGuards(ChatMemberGuard(ChatGateway.connectedUserChats))
    @SubscribeMessage('markAsOpenedMessage')
    async handleMarkAsOpenedMessage(client:AuthorizedSoket,@MessageBody() {chatId,messageId}){
        this.chatService.markAsOpenedMessage(client.userId,chatId,messageId);
        const chat=await this.chatService.getChat(chatId);
        this.server.to(chat!.room).emit('messageOpened',{chatId,messageId});
    }

};

