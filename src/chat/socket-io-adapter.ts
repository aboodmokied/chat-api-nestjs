import { INestApplicationContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { WsException } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthPayload } from "src/auth/auth.service";
import { AuthorizedSoket } from "src/types";

export class SocketIOAdapter extends IoAdapter{
    constructor(private app:INestApplicationContext){
        super(app);
    }
    createIOServer(port: number, options?: any) {
        // get your configurations and add them to options
        const server:Server=super.createIOServer(port,options);
        const jwtService=this.app.get(JwtService);
        server.use(authorizeSocketMiddleware(jwtService));
        return server;
    }
};

const authorizeSocketMiddleware=(jwtService:JwtService)=>(client:AuthorizedSoket,next)=>{
    const token=client.handshake.auth.token || client.handshake.headers['token'];
    try {
        const payload:AuthPayload=jwtService.verify(token);
        client.userId=payload.sub;
        return next();        
    } catch (error) {
        console.log('Unauthorized Socket');
        next(new UnauthorizedException('Unauthorized Socket'))
    }
};