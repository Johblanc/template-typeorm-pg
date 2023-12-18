import { Injectable } from '@nestjs/common';
import { Image } from './entities/image.entity';
import { fileRenamer } from 'src/utilities/Files/fileRenamer';
import { fileRemover } from 'src/utilities/Files/fileRemover';

@Injectable()
export class ImagesService {
  async createOrUpdate(
    file: Express.Multer.File,
    dir: string,
    name: string,
    alt: string,
  ) {
    let image = await Image.findOneBy({ file: name, dir });
    if (image === null) {
      image = Image.create({
        file: `${name}.${
          file.originalname.split('.')[file.originalname.split('.').length - 1]
        }`,
        dir,
        alt,
      });
    } else {
      image.alt = alt;
    }
    await image.save();

    fileRenamer(file.path, image.path);

    return image;
  }

  async findOne(dir: string, name: string) {
    const image = await Image.findOneBy({ file: name, dir });
    return image;
  }

  async remove(dir: string, name: string) {
    const image = await Image.findOneBy({ file: name, dir });
    if (image !== null) {
      fileRemover(`${process.env.DATA_PATH}/data/${image.path}`);
      await image.remove();
    }
  }
}
