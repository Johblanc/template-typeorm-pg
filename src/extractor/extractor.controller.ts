import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import { UsersExtractor } from './extractor.users.service';
import { UserAuthGuard } from 'src/auth/user_guard/user-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ArchiveFileInterceptor } from 'src/utilities/FileInterceptors/archive.file-interceptor';

@ApiTags('setup')
@Controller()
export class ExtractorController {
  constructor(
    private readonly usersExtractor: UsersExtractor,
  ) {}
  
  /** Extraction d'une archive zip */
  @UseGuards(UserAuthGuard)
  @Get('extract')
  async extract(@Res() res: Response) {
    /* Si le dossier data n'existe pas, on le crée */
    if (!fs.existsSync(`${process.env.DATA_PATH}/data`)) {
      fs.mkdirSync(`${process.env.DATA_PATH}/data`);
    }

    /* Création de l'archive json contenant les tables */
    fs.writeFileSync(
      `${process.env.DATA_PATH}/data/archive.json`,
      JSON.stringify({
        users: await this.usersExtractor.extract(),
        /* Pour chaque table ajouter une propriété */
      }),
    );

    /* Création du fichier .zip à partir du dossier /data */
    let zip = new AdmZip();
    zip.addLocalFolder(`${process.env.DATA_PATH}/data`);

    /* Préparation de la reponse */
    let zipFileContents = zip.toBuffer();
    let newNow = new Date();
    const fileName = `archive_${newNow.toISOString()}.zip`;
    const fileType = 'application/zip';
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': fileType,
    });
    /* Envoie de la reponse */
    return res.end(zipFileContents);
  }

  /** Réhinitialisation de la BdD depuis une archive zip */
  @UseGuards(UserAuthGuard)
  @Post('reset')
  @UseInterceptors(ArchiveFileInterceptor)
  async reset(@UploadedFiles() savedFiles: Express.Multer.File[] = []) {

    /* Suppression du dossier data */
    if (fs.existsSync(`${process.env.DATA_PATH}/data`))
      fs.rmSync(`${process.env.DATA_PATH}/data`, {
        recursive: true,
        force: true,
      });

    /* Nettoyage de la BdD */
    await this.usersExtractor.clear();
    /* Ajouter ici les methodes clear() de chaque Extractor.
     * Si vous avait des relations entre vos tables, 
     * l'ordre de suppression est important.  
     * */

    if (savedFiles.length > 0) {
      /* Si il y a un fichier, on le décompresse dans le dossier /data */
      let zip = new AdmZip(savedFiles[0].buffer);
      fs.mkdirSync(`${process.env.DATA_PATH}/data`);
      zip.getEntries().forEach((item, i) => {
        if (item.isDirectory) {
          if (!fs.existsSync(`/${item.entryName}`))
            fs.mkdirSync(`${process.env.DATA_PATH}/data/${item.entryName}`);
        } else {
          fs.writeFileSync(
            `${process.env.DATA_PATH}/data/${item.entryName}`,
            item.getData(),
          );
        }
      });
      /* Si il y a une archive zip, on rempli les tables */
      if (fs.existsSync(`${process.env.DATA_PATH}/data/archive.json`)) {
        let tables = require(`${process.env.DATA_PATH}/data/archive.json`);

        if (tables.users) await this.usersExtractor.reset(tables.users);
        /* Ajouter ici les methodes reset() de chaque Extractor.
         * Si vous avait des relations entre vos tables, 
         * l'ordre d'ajout est important.  
         * */
      }
    }
    return {
      message: 'Reinitialisation réalisée',
      data: undefined,
    };
  }
}
