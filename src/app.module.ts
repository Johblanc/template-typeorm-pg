
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ExtractorModule } from './extractor/extractor.module';
import { Image } from './images/entities/image.entity';
import { ImagesModule } from './images/images.module';
import { Role } from './roles/entities/role.entity';
import { RolesModule } from './roles/roles.module';
import { Contact } from './contacts/entities/contact.entity';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      logging: false,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Image,
        Role,
        Contact,
        /* Ajouter vos Entities */
      ],
      synchronize: true,
    }),
    UsersModule,
    ImagesModule,
    ExtractorModule,
    RolesModule,
    /* Ajouter vos Modules */
  ],
})
export class AppModule {}