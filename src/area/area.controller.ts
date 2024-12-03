import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { AreaService } from './area.service';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) { }

  @Get('/province')
  async fetchProvince() {
    return {
      provinces: await this.areaService.findProvince(),
      statusCode: HttpStatus.OK,
      message: 'success'
    }
  }

  @Get('/city/:province')
  async fetchCity(@Param('province') province: string) {
    return {
      cities: await this.areaService.findCity(province),
      statusCode: HttpStatus.OK,
      message: 'success'
    }
  }

  @Get('/sub-district/:city')
  async fetchSubDistrict(@Param('city') city: string) {
    return {
      subDistricts: await this.areaService.findSubDistrict(city),
      statusCode: HttpStatus.OK,
      message: 'success'
    }
  }

  @Get('/zip-code/:subDistrict')
  async fetchZipCode(@Param('subDistrict') subDistrict: string) {
    return {
      zipCodes: await this.areaService.findZipCode(subDistrict),
      statusCode: HttpStatus.OK,
      message: 'success'
    }
  }
}