import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle('Smarty')
    .setDescription('The Smarty API description')
    .setVersion('0.1.0')
    .addOAuth2()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.enableCors({
    credentials: true,
  });
  app.enableShutdownHooks();

  await app.listen(configService.get('port'));
}
bootstrap();
