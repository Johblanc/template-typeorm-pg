# Correctif

## Nom de dossier

Modififer le nom du dossier ```src/utilities/FileFilter``` par ```src/utilities/FileInterceptor```

## ArchiveFileInterceptor

Ajouter un fichier ```src/utilities/FileInterceptor/archive.file-interceptor.ts``` :

```ts
import { FilesInterceptor } from "@nestjs/platform-express";
import { zipFileFilter } from "./zip.file-filter";

export const ArchiveFileInterceptor = FilesInterceptor('files', undefined, {
  fileFilter: zipFileFilter,
})
```

## ExtractorController

Dans le fichier ```src/extractor/extractor.controller.ts```, corriger le ```@UseInterceptors``` du ```reset``` de la façon suivante :

```ts
@UseInterceptors(ArchiveFileInterceptor)
```

Supprimer les imports devenu obsolete.





