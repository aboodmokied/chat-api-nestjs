import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { HttpArgumentsHost, WsArgumentsHost } from "@nestjs/common/interfaces";
import { Response } from "express";
import { Error as MongooseError } from "mongoose";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        let context:HttpArgumentsHost|WsArgumentsHost=host.switchToHttp();
        const response=context.getResponse<Response>();
        if(exception instanceof HttpException){  // http exceptions
            const status=exception.getStatus();
            const errorPayload=exception.getResponse();
            return response.status(status).json(errorPayload);
        }else if(exception.code==11000){  // mongoose duplicated entry exeption
            console.log(exception)
        const message='Duplicate Key Error: '+JSON.stringify(exception.keyValue);
            const status=400;
            return response.status(status).json({
                statusCode:status,
                message
            });
        }else if(exception instanceof MongooseError.ValidationError){  // mongoose validation error
            const message=Object.values(exception.errors).map(err=>err.message).join(', ')
            const status=400;
            return response.status(status).json({
                statusCode:status,
                message
            });
        }else{
            const status=500;
            const message=exception.message || 'Internal Server Error';
            return response.status(status).json({
                statusCode:status,
                message
            });
        }
    }
};