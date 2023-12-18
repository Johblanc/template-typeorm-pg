# Extraction

## Installations

### Multer

```Shell
npm install --save multer
```

Multer avec typeScript

```Shell
npm install --save @types/multer
```

### Adm-zip

Pour créer un .zip

```Shell
npm install adm-zip
```

Adm-zip avec typeScript

```Shell
npm install --save @types/adm-zip
```

## Environnement

L'archive, avant d'être envoyer, doit être créée et stockée. Pour cela, l'API à besoin d'une adresse de stockage au bout duquelle elle créera un dossier ```data```. Ce dossier contiendra l'archive tampon.

Dans le fichier ```.env``` :

```
DATA_PATH = 'path/absolute/to/your/project'
```

Dans le fichier ```.gitignore``` :

```
/data
```

## Service UsersExtractor

Dans le fichier ```src/extractor/extractor.users.service.ts``` ajouter la methode :

```ts
async extract() {
  return await User.find({select : {
    id: true,
    pseudo: true,
    password: true,
    first_name: true,
    last_name: true,
    creat_at: true,
    actif_at: true,
    mail: true
  }});
}
```

## ExtractorController

Dans le fichier ```src/extractor/extractor.controller.ts``` :

```ts
import {
  Controller,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import { UsersExtractor } from './extractor.users.service';
import { UserAuthGuard } from 'src/auth/user_guard/user-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('setup')
@Controller()
export class ExtractorController {
  constructor(
    private readonly usersExtractor : UsersExtractor
    /* Pour chaque table ajouter un Excractor */
  ) {}

  @UseGuards(UserAuthGuard)
  @Get('extract')
  async extract(@Res() res: Response) {
    /* Si le dossier data n'existe pas, on le crée */
    if (!fs.existsSync(`${process.env.DATA_PATH}/data`))
    {
      fs.mkdirSync(`${process.env.DATA_PATH}/data`);
    }

    /* Création de l'archive json contenant les tables */
    fs.writeFileSync(
      `${process.env.DATA_PATH}/data/archive.json`,
      JSON.stringify({
        users : await this.usersExtractor.extract()
        /* Pour chaque table ajouter une propriété */
      }),
    );

    /* Création du fichier .zip à partir du dossier /data */
    let zip = new AdmZip();
    zip.addLocalFolder(`${process.env.DATA_PATH}/data`);

    /* Préparation de la reponse */
    let zipFileContents = zip.toBuffer();
    let newNow = new Date();
    const fileName = `archive_${newNow.toISOString()}.zip`;
    const fileType = 'application/zip';
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': fileType,
    });
    /* Envoie de la reponse */
    return res.end(zipFileContents);
  }
}
```
**ATTENTION** : ```@UseGuards(UserAuthGuard)``` permet à n'importe quel utilisateur de créer un archive. Il faudra rapidement créer un role admin pour limiter cette accés.

