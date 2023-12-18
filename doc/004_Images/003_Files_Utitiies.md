# Files Utilities

## Renomage d'un fichier

Créer un fichier ```src/utiliies/Files/fileRenamer.ts```

```ts
import * as fs from 'fs';

export const fileRenamer = (oldPath : string, newPath : string) => {
  const path = `${process.env.DATA_PATH}/data/${newPath}`

  if(fs.existsSync(path)){
    fs.rmSync(path)
  }
  fs.renameSync(oldPath, path)
  
}
```

## Suppression d'un fichier

Créer un fichier ```src/utiliies/Files/fileRemover.ts```

```ts
import * as fs from 'fs';

export const fileRemover = (path : string) => {
  if(fs.existsSync(path)){
    fs.rmSync(path)
  }
}
```

