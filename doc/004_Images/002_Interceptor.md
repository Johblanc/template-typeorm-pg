# User Image File Interceptor

## dataDestination

Permet de determiner dans quel dossier le fichier sera stoqué

Créer un fichier ```src/utilities/FileInterceptors/data.destination.ts```

```ts
import * as fs from 'fs';

export const dataDestination = (
  _: any,
  file: Express.Multer.File,
  cb: (error: Error | null, destination: string) => void,
  folder: string,
) => {
  const splited = `${process.env.DATA_PATH}/data/${folder}`.split('/');
  let dir = splited.shift() || '';
  while (splited.length > 0) {
    dir += `/${splited.shift()}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  }
  cb(null, dir);
};
```

## dataFilename

Permet de déterminer le nom du fichier stoqué

Créer un fichier ```src/utilities/FileInterceptors/data.file-name.ts```

```ts
export const dataFilename = (_ :any, file : Express.Multer.File , cb : (error: Error | null, filename: string) => void) => {
  cb(null, file.originalname.replace(/: /g, '-'))
}

```

## imageFileFilter

Contrôle du typage pour un fichier image

Créer un fichier ```src/utilities/FileInterceptors/image.file-filter.ts```

```ts
import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (
  _: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(`type de fichier non supporté`), false);
  }
};
```

## newOneFileInterceptor

Interceptor pour un seul fichier

Créer un fichier ```src/utilities/FileInterceptors/newOne.file-interceptor.ts```

```ts
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { imageFileFilter } from "./image.file-filter";
import { dataDestination } from "./data.destination";
import { dataFilename } from "./data.file-name";

export const newOneFileInterceptor = (attribut : string, folder : string) => FilesInterceptor(attribut, 1, {
  storage: diskStorage({
    destination: (req, file, cb) =>
    dataDestination(req, file, cb, folder),
    filename:  (req, file, cb) => dataFilename(req, file, cb),
  }),
  fileFilter: imageFileFilter,
})
```

## UserImageFileInterceptor

Intercepteur permatant de stoquer l'image d"un utilisateur

Créer un fichier ```src/utilities/FileInterceptors/userPhoto.file-interceptor.ts```

```ts
import { newOneFileInterceptor } from "./newOne.file-interceptor";

export const UserImageFileInterceptor = newOneFileInterceptor("image","img/users")
```
