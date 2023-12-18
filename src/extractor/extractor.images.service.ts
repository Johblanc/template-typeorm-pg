import { Injectable } from '@nestjs/common';
import { Image } from '../images/entities/image.entity';

/**
 * Services permetant les methodes relatives à l'extraction zip
 */
@Injectable()
export class ImagesExtractor {
  /**
   * Recupération des images en vue d'une extraction en zip
   *
   * @returns Toutes les images
   */
  async extract() {
    return await Image.find({select : {
      file: true,
      dir: true,
      alt: true,
    }});
  }

  /**
   * Suppression de toutes les images
   *
   * @returns Toutes les images supprimées
   */
  async clear() {
    return await Image.remove(await Image.find());
  }

  /**
   * Reinitialisation des images
   *
   * @returns Toutes les images
   */
  async reset(images: Image[]) {
    return await Promise.all(
      images.map(async (item) => {
        const newImage = Image.create(item);
        return await newImage.save();
      }),
    );
  }
}
