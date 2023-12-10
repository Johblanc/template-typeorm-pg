# Architecture du Projet pour la Table Users

## UsersService

C'est dans cette classe que l'on va déclarer toutes les methodes pour interagir avec la Table Utilisateur.

Créer un fichier ```src/users/users.service.ts```, et inclure le code suivant :

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  /* Ajouter les methodes de service ici */
}
```

Le décorateur ```@Injectable()``` permet déclarer la class ```UsersService``` comme étant un provider. 


## UsersController

C'est dans cette classe que l'on va déclarer toutes les methodes de routage de la Table Utilisateur. Il faudra qu'elles vérifient les données entrantes pour ne pas mettre la BdD en erreur.

Créer un fichier ```src/users/users.controller.ts```, et inclure le code suivant :

```ts
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
  /* Ajouter les methodes de service ici */
}
```

Le décorateur ```@ApiTags('Users')``` de Swagger, permet dans la documentation de grouper toutes les route contenu dans cette class sous le nom que l'on indique en paramètre, ici ```'Users'```.

Le décorateur ```@Controller('users')```  permet déclarer la class ```UsersController``` comme étant un contrôleur.


## UsersModule

C'est dans cette classe que l'on va déclarer comment ```UsersService``` et ```UsersController```interagissent avec le reste de l'API.

Créer un fichier ```src/users/users.controller.ts```, et inclure le code suivant :

```ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports : [],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
```
La classe ```UsersModule``` ne contient ni propriété, ni méthode. Elle est simplement décorée par ```@Module()``` qui la déclare comme un Module (quelle surprise !). Les options de ce décorateur sont au nombre de 4 et leurs valeurs sont des liste. Si une liste est vide, il est possible de ne pas écrire la propriété, mais pas habitude, je préfère les laiser. 

### ```imports```

Contient la liste des Modules dont au moins un élément est necéssaire pour les Controllers ou Services (Providers) des ce Module.

Pour éviter les imports cycliques entre deux Modules qui s'appellent mutuellement, il faudra remplacer la class par la fonction ```forwardRef```. Par exemple, si ```UsersModule``` et ```AuthModule``` doivent s'importer l'un l'autre, il faudra :

```ts
@Module({
  imports : [forwardRef(() => AuthModule)],
  /* ... */
})
export class UsersModule {}
```
et
```ts
@Module({
  imports : [forwardRef(() => UsersModule)],
  /* ... */
})
export class AuthModule {}
```


### ```controllers```

Liste des Controllers référencés par ce Module.

### ```providers```

Liste des Services référencés par ce Module.

### ```exports```

Liste des Services disponibles lorsque ce Module est importé.



## Déclaration

Dans ```src/app.module.ts```, importer ```UsersModule``` dans ```AppModule``` :

```ts
/* ... */
import { UsersModule } from './users/users.module';

@Module({
  /* ... */
  imports: [
    UsersModule,
  ],
})
export class AppModule {}
```

