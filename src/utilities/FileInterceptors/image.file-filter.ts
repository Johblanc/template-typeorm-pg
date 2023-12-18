import { BadRequestException } from '@nestjs/common';

/** Contrôle du typage pour un fichier image */
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
