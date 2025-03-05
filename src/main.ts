import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './chat/socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIOAdapter(app));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
