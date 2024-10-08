import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '#/utils/enums/status.enum';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsEnum(Status)
  status?: Status
}
