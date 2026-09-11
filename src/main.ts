import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:8100', 'http://localhost:4200'], // Adjust to your frontend port
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Enable static asset serving for uploaded avatars
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // 2. Bind the app to host '0.0.0.0' to accept network connections
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();
