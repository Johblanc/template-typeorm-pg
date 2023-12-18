import * as fs from 'fs';

/** Permet de determiner dans quel dossier le fichier sera stoqué */
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
