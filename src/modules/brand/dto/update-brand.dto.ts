import { PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '#/utils/enums/status.enum';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsOptional()
  @IsEnum(Status)
  status?: Status
}
