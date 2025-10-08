import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos no esperados
      forbidNonWhitelisted: true, // lanza error si llega un campo no definido
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
