import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";




@Schema()
export class AdminRegisterRequest extends Document {
    @Prop({required:true})
    name:string;

    @Prop({required:true,unique:true})
    email:string;

    @Prop({required:true})
    password:string

    @Prop({default:false})
    approved:boolean
};

export const AdminRegisterRequestSchema=SchemaFactory.createForClass(AdminRegisterRequest);