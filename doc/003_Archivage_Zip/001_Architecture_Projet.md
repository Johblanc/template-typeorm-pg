
# Archivage Architechture

Pour simplifier l'usage de l'extraction, il nous faut créer un nouveau Module qui contiendra :
* Un Service pour chaque table necessitant une extraction. 3 methodes :
  * ```extract``` pour récupérer toutes les lignes de la table et leurs données.
  * ```clear``` pour supprimer toutes les lignes de la table.
  * ```reset``` pour inclure dans la table un liste de données archivée.
* Un Controller ```ExtractorController``` avec 2 route :
  * GET ```extract``` permettant l'extraction d'une archive de la BdD au format .json dans un .zip.
  * POST ```reset``` permettant la réhinitialisation de la BdD a partir d'un fichier d'archive.

Commencer par la structure du dossier.

## Service UsersExtractor

Créer un fichier ```src/extractor/extractor.users.service.ts``` :

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersExtractor {
  /* Les Methodes iront ici */
}
```

## ExtractorController

Créer un fichier ```src/extractor/extractor.controller.ts``` :

```ts
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { UsersExtractor } from './extractor.users.service';

@ApiTags('setup')
@Controller()
export class ExtractorController {
  constructor(
    private readonly usersExtractor : UsersExtractor
  ) {}
  /* Les Methodes / Routes iront ici */
}
```

## ExtractorModule

Créer un fichier ```src/extractor/extractor.module.ts``` :

```ts
import { Module } from "@nestjs/common";
import { ExtractorController } from "./extractor.controller";
import { UsersExtractor } from "./extractor.users.service";

@Module({
  imports : [],
  controllers: [ExtractorController],
  providers: [UsersExtractor],
  exports: [],
})
export class ExtractorModule {}
```

## Déclaration

Dans le fichier ```src/app.module.ts```, ajouter ```ExtractorModule``` dans les imports :

```ts
/* ... */
import { ExtractorModule } from './extractor/extractor.module';

@Module({
  /* ... */
  imports: [
    /* ... */
    ExtractorModule,
  ],
})
export class AppModule {}
```

