import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './chat/socket-io-adapter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIOAdapter(app));
  app.useGlobalFilters(new AllExceptionsFilter());
  // Enable CORS for all origins
  app.enableCors();
  const PORT=process.env.PORT ?? 3000;
  app.listen(PORT).then(()=>{
    console.log('Server running on port:',PORT);
  });
}
bootstrap();
