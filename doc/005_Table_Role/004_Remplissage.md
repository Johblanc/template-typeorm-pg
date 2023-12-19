# Remplissage des Roles via l'extractor

## RolesExtractor

Créer un fichier ```src/extractor/extractor.roles.service.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class RolesExtractor {
  
  async clear() {
    return await Role.remove(await Role.find());
  }

  async reset() {
    const roles = [
      {
        nmae : "visitor",
        acces_level : 0
      },
      {
        nmae : "user",
        acces_level : 1
      },
      {
        nmae : "admin",
        acces_level : 2
      }
    ]

    return await Promise.all(
      roles.map(async (item) => {
        const newRole = Role.create(item);
        return await newRole.save();
      }),
    );
  }
}
```

## ExtractorModule

Dans le fichier ```src/extractor/extractor.module.ts``` ajouter la déclaration de ```RolesExtractor``` dans les providers :

```ts
/* ... */
import { RolesExtractor } from "./extractor.roles.service";

@Module({
  /* ... */
  providers: [
    UsersExtractor,
    ImagesExtractor,
    RolesExtractor,
  ],
  /* ... */
})
export class ExtractorModule {}
```

## ExtractorController

Dans le fichier ```src/extractor/extractor.controller.ts``` :

```ts
/* ... */
import { RolesExtractor } from './extractor.roles.service';

@ApiTags('Setup')
@Controller()
export class ExtractorController {
  constructor(
    /* ... */
    private readonly rolesExtractor: RolesExtractor,
  ) {}

  /* ... */
  async reset(@UploadedFiles() savedFiles: Express.Multer.File[] = []) {
    
    if (fs.existsSync(`${process.env.DATA_PATH}/data`))
    /* ... */
    await this.usersExtractor.clear();
    await this.imagesExtractor.clear();
    await this.rolesExtractor.clear();
    

    if (savedFiles.length > 0) {
      /* ... */

      if (fs.existsSync(`${process.env.DATA_PATH}/data/archive.json`)) {
        let tables = require(`${process.env.DATA_PATH}/data/archive.json`);

        await this.rolesExtractor.reset();
        if (tables.images) await this.imagesExtractor.reset(tables.images);
        if (tables.users) await this.usersExtractor.reset(tables.users);
      }
    }
    /* ... */
  }
}
```



