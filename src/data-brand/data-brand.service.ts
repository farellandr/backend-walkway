import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandDto } from "./dto/createDataBrand.dto";
import { Brand } from "./entities/brand.entity";
import { upDataBrand } from './dto/updateDataBrand.dto';


@Injectable()
export class DataBrandService {
    constructor(
        @InjectRepository(Brand)
        private BrandRepository: Repository<Brand>
    ){}

    async create(createBrand: CreateBrandDto){
        const tabBrand = new Brand
        tabBrand.BrandName= createBrand.BrandName
        tabBrand.status= createBrand.status
        tabBrand.Brand_image= createBrand.foto

        const result= await this.BrandRepository.insert(tabBrand)
        return await this.BrandRepository.findOneOrFail({
            where:{
                id: result.identifiers[0].id
            }
        })
    }

    async findAll(page: number, page_size: number){
        const skip= (page -1) * page_size
        const [count, data] = await Promise.all([
            this.BrandRepository.count({}),
            this.BrandRepository.find({
                order:{createdAt: 'ASC'}, skip,
                take: page_size
            })
        ])
        return{count, data};
    }

    async findOneDept(id: string) {
        const data = await this.BrandRepository.findOne({
          where:{id}})
    
        if(!data){
          throw new HttpException(
            {
              statuCode: HttpStatus.NOT_FOUND,
              error: "data not found",
            },
            HttpStatus.NOT_FOUND
          )
        }
    }
    

    async edit(id: string, updataBrand: upDataBrand){
        try {
            await this.findOneDept(id)
            const tabbrand=new Brand
            tabbrand.BrandName= updataBrand.BrandName
            tabbrand.status= updataBrand.status
            tabbrand.Brand_image= updataBrand.foto

        } catch (error) {
            throw error
        }
    }

    async remove(id:string){
        try {
            await this.findOneDept(id)

            await this.BrandRepository.softDelete(id)
            return 'Success'
        } catch (error) {
            throw error
        }
    }


}
