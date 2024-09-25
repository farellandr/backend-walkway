
import { PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from "./createDataBrand.dto";

export class upDataBrand extends PartialType(CreateBrandDto){}
// export class upDataBrand{
//     @IsNotEmpty()
//     BrandName?: string;

//     @IsEnum(SelectStatus)
//     status?: SelectStatus;

//     @IsNotEmpty()
//     foto?: string;
// }