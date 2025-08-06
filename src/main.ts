import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import './shared/utils/dayjs.config';

import { AppModule } from './app.module';
import { env } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Rate limiting
  // Values could be configured in env config
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // CORS configuration (more restrictive)
  app.enableCors({
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    forbidUnknownValues: true,
    skipMissingProperties: false,
  }));

  const config = new DocumentBuilder()
    .setTitle('Interbanking API')
    .setDescription('REST API with hexagonal architecture for company management')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // env.PORT - example of required env variable
  await app.listen(env.PORT);
  console.log(`Application is running on: http://localhost:${env.PORT}`);
  console.log(`Swagger documentation available at: http://localhost:${env.PORT}/api`);
}

bootstrap(); 