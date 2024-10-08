import { PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '#/common/enums/status.enum';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsOptional()
  @IsEnum(Status)
  status?: Status
}
