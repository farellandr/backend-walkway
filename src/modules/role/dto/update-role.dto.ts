import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '#/utils/enums/status.enum';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsEnum(Status)
  status?: Status
}
