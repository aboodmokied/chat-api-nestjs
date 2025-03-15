import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { WsArgumentsHost } from "@nestjs/common/interfaces";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Catch()
export class WsExceptionsFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        let context:WsArgumentsHost=host.switchToWs();
        const client:Socket=context.getClient();
        if(exception instanceof WsException){  // websocket exceptions
            context=host.switchToWs();
            const client:Socket=context.getClient();
            const message=exception.getError() || 'An Unknown Error Occurred'
            return client.emit('error',{
                status:400,
                message
            })
        }else if(exception instanceof BadRequestException){  // Bad request exceptions
            context=host.switchToWs();
            const client:Socket=context.getClient();
            const errorPayload=exception.getResponse() || 'An Unknown Error Occurred'
            return client.emit('error',errorPayload)
        }else{
            const status=400;
            const message=exception.message || 'Internal Server Error';
            return client.emit('error',{
                status,
                message
            })
        }
    }
};