import { PartialType } from '@nestjs/swagger';
import { CreateBidProductDto } from './create-bid-product.dto';

export class UpdateBidProductDto extends PartialType(CreateBidProductDto) {}
