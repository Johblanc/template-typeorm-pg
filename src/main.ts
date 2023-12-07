import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponserExeption } from './interceptors/responser.exeption';
import { ResponserInterceptor } from './interceptors/responser.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/');
  app.useGlobalInterceptors(new ResponserInterceptor());
  app.useGlobalFilters(new ResponserExeption());
  await app.listen(8000);
}
bootstrap();
