import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AreaService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) { }

  private url = this.configService.get<string>('area.url')

  async findProvince() {
    const response = await lastValueFrom(this.httpService.get(`${this.url}/provinces`));
    return response.data.provinces;
  }

  async findCity(province: string) {
    const response = await lastValueFrom(this.httpService.get(`${this.url}/cities/${province}`));
    if (response.data.provinces.length == 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data not found.',
          message: `No cities found for the province: ${province.toUpperCase()}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return response.data.provinces;
  }

  async findSubDistrict(city: string) {
    const response = await lastValueFrom(this.httpService.get(`${this.url}/sub-districts/${city}`));
    if (response.data.sub_districts == 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data not found.',
          message: `No cities found for the province: ${city.toUpperCase()}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return response.data.sub_districts;
  }

  async findZipCode(subDistrict: string) {
    const response = await lastValueFrom(this.httpService.get(`${this.url}/zip-codes/${subDistrict}`));
    if (response.data.zip_codes == 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data not found.',
          message: `No cities found for the province: ${subDistrict.toUpperCase()}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return response.data.zip_codes;
  }
}
