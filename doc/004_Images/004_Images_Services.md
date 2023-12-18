# Services pour l'entité Image

## Création des Services

Créer un fichier ```src/images/images.services.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { Image } from './entities/image.entity';
import { fileRenamer } from 'src/utilities/Files/fileRenamer';
import { fileRemover } from 'src/utilities/Files/fileRemover';

@Injectable()
export class ImagesService {
  
  async createOrUpdate(file: Express.Multer.File, dir : string, name : string, alt: string) {
    let image = await Image.findOneBy({file:name,dir})
    if (image === null){
      image = Image.create({file : `${name}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`, dir, alt})
    }
    else {
      image.alt = alt
    }
    await image.save()

    fileRenamer(file.path, image.path)

    return image
  }  

  async remove(dir : string, name : string){
    const image = await Image.findOneBy({file : name, dir})
    if (image !== null) {
      fileRemover(`${process.env.DATA_PATH}/data/${image.path}`)
      await image.remove()
    }
  }
}
```

## Module images

Créer un fichier ```src/images/images.module.ts``` :

```ts
import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';

@Module({
  controllers: [],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
```

## Déclaration

Dans le fichier ```src/app.module.ts```, ajouter ```ImagesModule``` aux imports :

```ts
/* ... */
import { ImagesModule } from './images/images.module';

@Module({
  /* ... */
  imports: [
    /* ... */
    UsersModule,
    ImagesModule,
    ExtractorModule,
  ],
})
export class AppModule {}
```


## Liaison

Dans le fichier ```src/users/users.module.ts```, ajouter ```ImagesModule``` aux imports :

```ts
/* ... */
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [forwardRef(() => AuthModule), ImagesModule],
  /* ... */
})
export class UsersModule {}
```

