import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { ChatModule } from './chat/chat.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { AdminRegisterModule } from './admin-register/admin-register.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat'),
    UserModule,
    AuthModule,
    RolesModule,
    SeederModule,
    ChatModule,
    SuperAdminModule,
    AdminRegisterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit{
  constructor(private readonly seederService:SeederService){}
  async onModuleInit() {
    await this.seederService.run();
  }
}
