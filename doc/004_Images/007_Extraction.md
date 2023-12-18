# Extraction

## ImagesExtractor

Créer un fichier ```src/extractor/extractor.images.services.ts```

```ts
import { Injectable } from '@nestjs/common';
import { Image } from '../images/entities/image.entity';

@Injectable()
export class ImagesExtractor {
  
  async extract() {
    return await Image.find({select : {
      file: true,
      dir: true,
      alt: true,
    }});
  }
  
  async clear() {
    return await Image.remove(await Image.find());
  }
  
  async reset(images: Image[]) {
    return await Promise.all(
      images.map(async (item) => {
        const newImage = Image.create(item);
        return await newImage.save();
      }),
    );
  }
}
```

## ExtractorModule

Dans le fichier ```src/extractor/extractor.module.ts``` ajouter ```ImagesExtractor``` aux providers:

```ts
/* ... */
import { ImagesExtractor } from "./extractor.images.service";

@Module({
  /* ... */
  providers: [
    /* ... */
    ImagesExtractor,
    ],
})
export class ExtractorModule {}
```

## UsersExtractor

Dans le fichier ```src/extractor/extractor.users.services.ts``` ajouter l'extraction de la relation :

```ts
/* ... */

@Injectable()
export class UsersExtractor {
  
  async extract() {
    return await User.find({
      select: {
        /* ... */
        image: { dir: true, file: true },
      },
    });
  }
  /* ... */
}
```

## ExtractorController

Dans le fichier ```src/extractor/extractor.controller.ts``` utiliser les différents services :

```ts
/* ... */
import { ImagesExtractor } from './extractor.images.service';

@ApiTags('setup')
@Controller()
export class ExtractorController {
  constructor(
    /* ... */
    private readonly imagesExtractor: ImagesExtractor,
  ) {}

  /* ... */
  async extract(@Res() res: Response) {
    /* ... */
    fs.writeFileSync(
      `${process.env.DATA_PATH}/data/archive.json`,
      JSON.stringify({
        images : await this.imagesExtractor.extract(),
        users: await this.usersExtractor.extract(),
      }),
    );/* ... */
  }

  /* ... */
  async reset(@UploadedFiles() savedFiles: Express.Multer.File[] = []) {
    /* ... */

    await this.usersExtractor.clear();
    await this.imagesExtractor.clear();
    

    if (savedFiles.length > 0) {
      /* ... */
      if (fs.existsSync(`${process.env.DATA_PATH}/data/archive.json`)) {
        /* ... */
        if (tables.images) await this.imagesExtractor.reset(tables.images);
        if (tables.users) await this.usersExtractor.reset(tables.users);
      }
    }
    /* ... */
  }
}
```







