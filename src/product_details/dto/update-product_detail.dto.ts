import { PartialType } from '@nestjs/swagger';
import { CreateProductDetailDto } from './create-product_detail.dto';

export class UpdateProductDetailDto extends PartialType(CreateProductDetailDto) {}
