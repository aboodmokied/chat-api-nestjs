import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { User, UserSchema } from 'src/schemas/User';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}])],  
  providers: [SeederService],
  exports:[SeederService]
})
export class SeederModule {}
