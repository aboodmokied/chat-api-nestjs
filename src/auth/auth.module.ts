import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AccessToken, AccessTokenSchema } from 'src/schemas/AccessToken';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
 
@Module({
  imports:[
    PassportModule,
    // JwtModule.register({
    //   secret:process.env.JWT_SECRET,
    //   signOptions:{
    //     expiresIn:process.env.JWT_EXPIRATION
    //   }
    // }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:async(configService:ConfigService)=>({
        secret:configService.get<string>('JWT_SECRET'),
        signOptions:{
          expiresIn:configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject:[ConfigService]
    }),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{name:AccessToken.name,schema:AccessTokenSchema}]),
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy,JwtAuthGuard],
  exports: [JwtAuthGuard,AuthService]
})
export class AuthModule {}
