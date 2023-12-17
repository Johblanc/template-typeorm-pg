import { BadRequestException } from '@nestjs/common';

/** Contrôle du typage pour un fichier zip */
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
