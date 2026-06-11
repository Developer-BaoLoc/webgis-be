import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(
      app.get(Reflector),
    ),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://*.ngrok-free.app',
      'https://*.ngrok-free.dev',
    ],
    credentials: true,
  });

  const port =
    process.env.PORT || process.env.APP_PORT || 3001;

  await app.listen(port);

  console.log(`API running on port ${port}`);
}
bootstrap();
