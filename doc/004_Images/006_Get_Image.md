# Recupération d'une image

## ImagesService

Dans le fichier ```src/images/images.services.ts``` ajouter la methode ```findOne``` :

```ts
async findOne(dir: string, name: string) {
  const image = await Image.findOneBy({ file: name, dir });
  return image;
}
```

## ImagesController

Créer un fichier ```src/images/images.controller.ts``` :

```ts
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('img')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':group/:imageName')
  async findOne(
    @Param('group') group: string,
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const dir = `img/${group}`;
    const photo = await this.imagesService.findOne(dir, imageName);
    if (photo === null) throw new NotFoundException("Cette Photo n'existe pas");
    if (!fs.existsSync(`${process.env.DATA_PATH}/data/${photo.path}`))
      throw new NotFoundException("Cette Photo n'existe pas");
    return res.sendFile(photo.path, {
      root: `${process.env.DATA_PATH}/data`,
    });
  }
}
```
## Déclaration 

Dans le fichier ```src/images/images.module.ts``` ajouter ```ImagesController``` aux controllers :

```ts
/* ... */
import { ImagesController } from './images.controller';

@Module({
  controllers: [ImagesController],
  /* ... */
})
export class ImagesModule {}
```



