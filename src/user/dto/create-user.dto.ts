import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Roles } from "src/schemas/User";

export class CreateUserDto{
    @IsString()
    name:string;
    @IsEmail()
    email:string;
    @IsNotEmpty()
    password:string
    @IsEnum(Roles)
    role:Roles
};