import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponserExeption } from './interceptors/responser.exeption';
import { ResponserInterceptor } from './interceptors/responser.interceptor';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import helmet from 'helmet';

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
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ResponserInterceptor());
  app.useGlobalFilters(new ResponserExeption());
  await app.listen(8000);
}
bootstrap();
