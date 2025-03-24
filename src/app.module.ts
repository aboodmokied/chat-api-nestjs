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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:async(configService:ConfigService)=>({
        uri:configService.get<string>('DB_URI')
      }),
      inject:[ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }),
    UserModule,
    AuthModule,
    RolesModule,
    SeederModule,
    ChatModule,
    SuperAdminModule,
    AdminRegisterModule,
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
