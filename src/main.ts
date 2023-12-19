import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponserExeption } from './interceptors/responser.exeption';
import { ResponserInterceptor } from './interceptors/responser.interceptor';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: 'cross-origin',
    }),
  );
  app.setGlobalPrefix('api/');
  app.enableCors({
    origin: [process.env.SITE_URL!],              // Adresses autorisées à interroger l'API
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Methodes de requete autorisées
    credentials: true,                            // Transmition du header de la requete
  });
  const config = new DocumentBuilder()
    .setTitle('titre API')
    .setDescription('description API')
    .setVersion('1.0')
    .addBearerAuth(undefined,"visitor")
    .addBearerAuth(undefined,"user")
    .addBearerAuth(undefined,"admin")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ResponserInterceptor());
  app.useGlobalFilters(new ResponserExeption());
  await app.listen(8000);
}
bootstrap();
