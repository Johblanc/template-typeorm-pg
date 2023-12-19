import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('img')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':group/:imageName')
  async findOne(
    @Param('group') group: string,
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const dir = `img/${group}`;
    const photo = await this.imagesService.findOne(dir, imageName);
    if (photo === null) throw new NotFoundException("Cette Photo n'existe pas");
    if (!fs.existsSync(`${process.env.DATA_PATH}/data/${photo.path}`))
      throw new NotFoundException("Cette Photo n'existe pas");
    return res.sendFile(photo.path, {
      root: `${process.env.DATA_PATH}/data`,
    });
  }
}
