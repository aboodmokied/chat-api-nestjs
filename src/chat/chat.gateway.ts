import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'], // Specify allowed methods
        credentials: true, // Include credentials if needed
      },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server:Server;
    constructor(){}
    // inhereted listeners
    handleConnection(client: Socket) {
        console.log('Client Connected:',client.id);
        this.server.emit('userConnected',`User Connected: ${client.id}`);
    }
    handleDisconnect(client: Socket) {
        console.log('Client Connected:',client.id);
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

};