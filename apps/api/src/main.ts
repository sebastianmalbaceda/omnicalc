import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:19006',
      'http://localhost:8081',
      process.env.MARKETING_URL || 'http://localhost:3000',
      process.env.WEB_APP_URL || 'http://localhost:3002',
    ].filter(Boolean),
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use('/payments/webhooks/stripe', bodyParser.raw({ type: 'application/json' }));

  const config = new DocumentBuilder()
    .setTitle('OmniCalc API')
    .setDescription('Central API for OmniCalc SaaS — Authentication, Calculations, Users, Billing')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port);

  console.log(`[API] Running on http://localhost:${port}`);
  console.log(`[API] Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
