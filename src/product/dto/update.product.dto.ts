import { PartialType } from "@nestjs/swagger";
import { CreateProductDto } from "./create.product.dto";

export class UpProduct extends PartialType(CreateProductDto){}