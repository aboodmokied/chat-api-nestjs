import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthorizedSoket } from "src/types";
import { ChatService } from "./chat.service";


@WebSocketGateway({
    // namespace:'chat',
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'], // Specify allowed methods
        credentials: true, // Include credentials if needed
      },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private activeUsers=new Map<string,string>(); // userId -> socketId
    @WebSocketServer()
    private server:Server;
    constructor(private chatService:ChatService){}
    // inhereted listeners
    async handleConnection(client: AuthorizedSoket) {
        console.log('Client Connected:',client.id);
        await this.chatService.userChats(client.userId);
        // add it to active users
        this.activeUsers.set(client.userId,client.id);
        // get its rooms
        const userRooms=await this.chatService.userRooms(client.userId); 
        // join to them
        client.join(userRooms); 
        this.server.emit('userConnected',`User Connected: ${client.id}`);
    }
    handleDisconnect(client: AuthorizedSoket) {
        this.activeUsers.delete(client.userId);
        this.server.emit('userDisconnected',`User Disconnected: ${client.id}`);
    }

    // custom listeners
    @SubscribeMessage('message')
    async handleMessage(client:Socket,{message}){
        // this.server.emit
        console.log('Message Recieved',message)
        // console.log('From',client.id)
        client.broadcast.emit('message',`Message: ${message}, From: ${client.id}`);
    }

    // TODO: validate if the sender is a member in the room
    @SubscribeMessage('privateMessage')
    async handlePrivateMessage(client:Socket,{room,message}){
        this.server.to(room).emit('message',`Message: ${message}, From: ${client.id}`);
    }

    // join a room listener
    @SubscribeMessage('joinChat')
    async handlePrivateChat(@ConnectedSocket() client:Socket,@MessageBody() data:{senderId:string,recieverID:string}){
        const {senderId,recieverID}=data;
        const roomName=await this.chatService.joinChat(senderId,recieverID);
        // join the current user to this new chat
        client.join(roomName);
        // get the second user socket if its connected (using recieverID), and join it to this chat
        const recieverSocketId=this.activeUsers.get(recieverID);
        if(recieverSocketId){ // if the user active
            const recieverSocket=this.server.sockets.sockets.get(recieverSocketId);
            recieverSocket?.join(roomName);
        }
        this.server.to(roomName).emit('newChat',{room:roomName,users:[senderId,recieverID]});
    }

    @SubscribeMessage('myChats')
    async handlerMyChats(client:AuthorizedSoket){
        const chats=await this.chatService.userChats(client.userId);
        this.server.to(client.id).emit('myChats',{chats});
    }

};

