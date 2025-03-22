import { Module } from '@nestjs/common';
import { AdminRegisterService } from './admin-register.service';
import { AdminRegisterController } from './admin-register.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminRegisterRequest, AdminRegisterRequestSchema } from 'src/schemas/AdminRegisterRequest';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[UserModule,MongooseModule.forFeature([{name:AdminRegisterRequest.name,schema:AdminRegisterRequestSchema}]),AuthModule],
  providers: [AdminRegisterService],
  controllers: [AdminRegisterController]
})
export class AdminRegisterModule {}
