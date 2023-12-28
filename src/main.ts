import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// global.crypto = require('crypto');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  const corsOpts: CorsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
  };

  app.enableCors(corsOpts);

  await app.listen(3000);
}

bootstrap();
