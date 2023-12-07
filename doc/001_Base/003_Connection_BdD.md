# Connection à la base de donnée

## Installation Complémentaire

### nestjs/config

Pour accéder au contenu du fichier .env

```Shell
npm i --save @nestjs/config
```


## Environnement de l'API

Dans le ```.env``` :

```conf
DATABASE_HOST='localhost'
DATABASE_PORT=5432
DATABASE_USERNAME='postgres'
DATABASE_PASSWORD='mdp'
DATABASE_NAME='bdd'
```

### DATABASE_HOST

Adresse de la base de données

### DATABASE_PORT

Port de la base de données

### DATABASE_USERNAME

Nom de l'utilisateur de la base de données

### DATABASE_PASSWORD

Mot de passe de l'utilisateur de la base de données

### DATABASE_NAME

Nom de la base de données



## Module de l'application

Dans ```app.module.ts``` :

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        /* Ajouter vos Entities */
      ],
      synchronize: true,
    }),
    /* Ajouter vos Modules */
  ],
})
export class AppModule {}
```


