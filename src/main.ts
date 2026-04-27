import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v1');
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();
  app.useWebSocketAdapter(new WsAdapter(app));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`StakeGood API running on port ${port}`);
}

bootstrap();
