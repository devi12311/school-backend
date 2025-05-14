import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
      preflightContinue: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
      credentials: true, // Allow credentials (e.g., cookies)
      allowedHeaders: 'Content-Type, Accept', // Allowed headers
    }
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
