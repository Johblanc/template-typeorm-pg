# Correctif imageFileFilter

Dans ```src/utilities/FileInterceptors/image.file-filter.ts``` corriger le ```RegExp``` :

```ts
import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (
  _: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (file.originalname.match(/\.(tiff|jfif|bmp|gif|svg|png|jpeg|svgz|jpg|webp|ico|xbm|dib|pjp|apng|tif|pjpeg|avif)$/)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(`type de fichier non supporté`), false);
  }
};
```