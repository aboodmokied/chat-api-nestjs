import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./User";



@Schema()
export class AccessToken extends Document {
    @Prop({required:true,unique:true})
    token:string;
    @Prop({required:true,ref:User.name})
    user:string
    @Prop({default:false})
    revoked:boolean;
};

export const AccessTokenSchema=SchemaFactory.createForClass(AccessToken);