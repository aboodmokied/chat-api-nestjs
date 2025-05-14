import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { WsArgumentsHost } from "@nestjs/common/interfaces";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Catch()
export class WsExceptionsFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        let context:WsArgumentsHost=host.switchToWs();
        const client:Socket=context.getClient();
        const data=context.getData();
        if(exception instanceof WsException){  // websocket exceptions
            context=host.switchToWs();
            const client:Socket=context.getClient();
            const message=exception.getError() || 'An Unknown Error Occurred'
            return client.emit('error',{
                event: data?.event || 'unknown',
                status:400,
                message
            })
        }else if (exception instanceof BadRequestException) {
            const errorResponse = exception.getResponse();
            let message = 'Bad Request';
            if (typeof errorResponse === 'object' && errorResponse !== null) {
                message = (errorResponse as any).message || message;
            }
            return client.emit('validation_error', {
                event: data?.event || 'unknown',
                status: 400,
                message,
            });
        }else{
            const status=500;
            const message=exception.message || 'Internal Server Error';
            return client.emit('error',{
                event: data?.event || 'unknown',
                status,
                message
            })
        }
    }
};