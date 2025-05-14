import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:5173', 'https://tek-front.n7ujc3.easypanel.host'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed methods
      credentials: true, // Allow credentials (e.g., cookies)
      // allowedHeaders: 'Content-Type, Accept', // Allowed headers
    }
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
