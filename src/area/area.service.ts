import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AreaService {
  private url = 'http://103.196.154.8:8765/api';

  constructor(
    private readonly httpService: HttpService,
  ) { }

  async findProvince() {
    try {
      const response = await lastValueFrom(this.httpService.get(`${this.url}/provinces`));
      return response.data.provinces;
    } catch (error) {
      throw new Error(`Failed to fetch provinces: ${error.message}`);
    }
  }
  
  async findCity(province: string) {
    try {
      const response = await lastValueFrom(this.httpService.get(`${this.url}/cities/${province}`));
      return response.data.provinces;
    } catch (error) {
      throw new Error(`Failed to fetch cities: ${error.message}`);
    }
  }

  async findSubDistrict(city: string) {
    try {
      const response = await lastValueFrom(this.httpService.get(`${this.url}/sub-districts/${city}`));
      return response.data.sub_districts;
    } catch (error) {
      throw new Error(`Failed to fetch sub district: ${error.message}`);
    }
  }

  async findZipCode(subDistrict: string) {
    try {
      const response = await lastValueFrom(this.httpService.get(`${this.url}/zip-codes/${subDistrict}`));
      return response.data.zip_codes;
    } catch (error) {
      throw new Error(`Failed to fetch sub district: ${error.message}`);
    }
  }
}
