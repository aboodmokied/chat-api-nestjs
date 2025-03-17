import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "../roles.enum";
import { Request } from "express";
import { AuthPayload } from "src/auth/auth.service";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles=this.reflector.get<Roles[]>('roles',context.getHandler()) || this.reflector.get<Roles[]>('roles',context.getClass());
        if(!requiredRoles){ // no required roles
            return true;
        }
        const request:Request=context.switchToHttp().getRequest();
        const user=request.user as AuthPayload;
        // check the roles
        if(!user || !requiredRoles?.some(role=>user.roles.includes(role))){
            throw new ForbiddenException('You Do Not Have Permission To Access This Resource.'); 
        }
        return true;
    }
};