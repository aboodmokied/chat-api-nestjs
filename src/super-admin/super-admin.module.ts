import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { User, UserSchema } from 'src/schemas/User';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),AuthModule],
  controllers: [SuperAdminController],
  providers: [SuperAdminService]
})
export class SuperAdminModule {}
