import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AreaService } from './area.service';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('/province')
  async fetchProvince() {
    return await this.areaService.findProvince()
  }

  @Get('/city/:province')
  async fetchCity(@Param('province') province: string) {
    return await this.areaService.findCity(province)
  }

  @Get('/sub-district/:city')
  async fetchSubDistrict(@Param('city') city: string) {
    return await this.areaService.findSubDistrict(city)
  }

  @Get('/zip-code/:subDistrict')
  async fetchZipCode(@Param('subDistrict') subDistrict: string) {
    return await this.areaService.findZipCode(subDistrict)
  }
}