# Reset

## Utilitaire

### zipFileFilter

Fonction permetant le contrôle du type du fichier entrant. Ici un fichier zip.

Créer un fichier ```src/utilities/FileFilter/zip.file-filter.ts``` :

```ts
import { BadRequestException } from '@nestjs/common';

export const zipFileFilter = (
  _: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (file.originalname.match(/\.zip$/) && file.mimetype === "application/x-zip-compressed") {
    cb(null, true);
  } else {
    cb(new BadRequestException(`type de fichier non supporté`), false);
  }
};
```

## Service UsersExtractor

Dans le fichier ```src/extractor/extractor.users.service.ts``` ajouter les methodes :

```ts
async clear() {
  return await User.remove(await User.find());
}

async reset(users: User[]) {
  return await Promise.all(
    users.map(async (item) => {
      const newUser = User.create(item);
      newUser.id = item.id;
      return await newUser.save();
    }),
  );
}
```

## ExtractorController

Dans le fichier ```src/extractor/extractor.controller.ts``` :

```ts
/* ... */
import { FilesInterceptor } from '@nestjs/platform-express';
import { zipFileFilter } from '../utilities/FileFilter/zip.file-filter';

/* ... */
export class ExtractorController {
  /* ... */
  @UseGuards(UserAuthGuard)
  @Post('reset')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: zipFileFilter,
    }),
  )
  async reset(@UploadedFiles() savedFiles: Express.Multer.File[] = []) {

    /* Suppression du dossier data */
    if (fs.existsSync(`${process.env.DATA_PATH}/data`))
      fs.rmSync(`${process.env.DATA_PATH}/data`, {
        recursive: true,
        force: true,
      });

    /* Nettoyage de la BdD */
    await this.usersExtractor.clear();
    /* Ajouter ici les methodes clear() de chaque Extractor.
     * Si vous avait des relations entre vos tables, 
     * l'ordre de suppression est important.  
     * */

    if (savedFiles.length > 0) {
      /* Si il y a un fichier, on le décompresse dans le dossier /data */
      let zip = new AdmZip(savedFiles[0].buffer);
      fs.mkdirSync(`${process.env.DATA_PATH}/data`);
      zip.getEntries().forEach((item, i) => {
        if (item.isDirectory) {
          if (!fs.existsSync(`/${item.entryName}`))
            fs.mkdirSync(`${process.env.DATA_PATH}/data/${item.entryName}`);
        } else {
          fs.writeFileSync(
            `${process.env.DATA_PATH}/data/${item.entryName}`,
            item.getData(),
          );
        }
      });
      /* Si il y a une archive zip, on rempli les tables */
      if (fs.existsSync(`${process.env.DATA_PATH}/data/archive.json`)) {
        let tables = require(`${process.env.DATA_PATH}/data/archive.json`);

        if (tables.users) await this.usersExtractor.reset(tables.users);
        /* Ajouter ici les methodes reset() de chaque Extractor.
         * Si vous avait des relations entre vos tables, 
         * l'ordre d'ajout est important.  
         * */
      }
    }
    return {
      message: 'Reinitialisation réalisée',
      data: undefined,
    };
  }
}

```
**ATTENTION** : ```@UseGuards(UserAuthGuard)``` permet à n'importe quel utilisateur de créer un archive. Il faudra rapidement créer un role admin pour limiter cette accés.


