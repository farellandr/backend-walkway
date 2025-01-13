import { uploadImageHelper } from '#/utils/helpers/upload-helper';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { of } from 'rxjs';

@Controller('')
export class ImageController {
  @Post('/upload')
  @UseInterceptors(FileInterceptor('image', uploadImageHelper()))
  async upload(@UploadedFile() image: Express.Multer.File) {
    if (!image || typeof image == undefined) {
      throw new BadRequestException();
    }

    return { filename: image.filename };
  }

  @Get('/upload/:image')
  getImage(@Param('image') filename: string, @Res() res: any) {
    return of(res.sendFile(join(process.cwd(), `/uploads/images/${filename}`)));
  }
}
