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
import { FilesInterceptor } from '@nestjs/platform-express';
import { UsersExcractor } from './extractor.users.service';
import { UserAuthGuard } from 'src/auth/user_guard/user-auth.guard';
import { zipFileFilter } from '../utilities/FileFilter/zip.file-filter';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('setup')
@Controller()
export class ExtractorController {
  constructor(private readonly usersExtractor: UsersExcractor) {}
  
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
}
