import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create.product.dto";
import { UpProduct } from './dto/update.product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ){}

    async createProduct(createProductdto:CreateProductDto) {
        // const findBrand = await this.dataBrandService.getbyId(createProductdto.brand_id)
        const resultProduct = new Product()
        resultProduct.nameProduct = createProductdto.nameProduct
        resultProduct.price = createProductdto.price
        resultProduct.brand_id= createProductdto.brand_id
        const result = await this.productRepository.insert(resultProduct);
        return this.productRepository.findOneOrFail({
            where:{id:result.identifiers[0].id,},
        });
    }

    findAll(){
        return this.productRepository.findAndCount();
    }

    async findOne(id: string){
        try {
            return await this.productRepository.findOneOrFail({
                where:{id,}, 
                relations:{brand:true}
            })
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new HttpException(
                  {
                    statusCode: HttpStatus.NOT_FOUND,
                    error: 'Data not found',
                  },
                  HttpStatus.NOT_FOUND,
                );
              } else {
                throw e;
              }
        }
    }

    async update(id:string, upProduct: UpProduct ){
        try {
            await this.productRepository.findOneOrFail({
                where:{id,},
            })
           
        } catch (error) {
            throw error;
        }
        
        await this.productRepository.update(id, upProduct);
        return this.productRepository.findOneOrFail({
            where:{id,},
        });
    }

    async hapus(id: string){
        try {
            await this.findOne(id)
            await this.productRepository.softDelete(id)
            return 'Success'
        } catch (e) {
            throw e
        }
    }
}
