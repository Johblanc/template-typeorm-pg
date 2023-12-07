import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponserExeption } from './interceptors/responser.exeption';
import { ResponserInterceptor } from './interceptors/responser.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/');
  app.enableCors({
    origin: [process.env.SITE_URL!],              // Adresses autorisées à interroger l'API
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Methodes de requete autorisées
    credentials: true,                            // Transmition du header de la requete
  });
  app.useGlobalInterceptors(new ResponserInterceptor());
  app.useGlobalFilters(new ResponserExeption());
  await app.listen(8000);
}
bootstrap();
