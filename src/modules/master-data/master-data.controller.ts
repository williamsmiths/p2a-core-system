import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import { Public } from '@common';
import {
  CreateCountryDto,
  CreateCityDto,
  CreateDistrictDto,
  UpdateCountryDto,
  UpdateCityDto,
  UpdateDistrictDto,
} from './dto';

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  // ==================== COUNTRIES ====================

  @Public()
  @Get('countries')
  async findAllCountries() {
    return this.masterDataService.findAllCountries();
  }

  @Public()
  @Get('countries/:id')
  async findCountryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterDataService.findCountryById(id);
  }

  @Post('countries')
  async createCountry(@Body() dto: CreateCountryDto) {
    return this.masterDataService.createCountry(dto);
  }

  @Put('countries/:id')
  async updateCountry(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCountryDto,
  ) {
    return this.masterDataService.updateCountry(id, dto);
  }

  @Delete('countries/:id')
  async deleteCountry(@Param('id', ParseUUIDPipe) id: string) {
    await this.masterDataService.deleteCountry(id);
    return { message: 'Country deleted successfully' };
  }

  // ==================== CITIES ====================

  @Public()
  @Get('cities')
  async findAllCities() {
    return this.masterDataService.findAllCities();
  }

  @Public()
  @Get('cities/by-country/:countryId')
  async findCitiesByCountryId(@Param('countryId', ParseUUIDPipe) countryId: string) {
    return this.masterDataService.findCitiesByCountryId(countryId);
  }

  @Public()
  @Get('cities/:id')
  async findCityById(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterDataService.findCityById(id);
  }

  @Post('cities')
  async createCity(@Body() dto: CreateCityDto) {
    return this.masterDataService.createCity(dto);
  }

  @Put('cities/:id')
  async updateCity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCityDto,
  ) {
    return this.masterDataService.updateCity(id, dto);
  }

  @Delete('cities/:id')
  async deleteCity(@Param('id', ParseUUIDPipe) id: string) {
    await this.masterDataService.deleteCity(id);
    return { message: 'City deleted successfully' };
  }

  // ==================== DISTRICTS ====================

  @Public()
  @Get('districts')
  async findAllDistricts() {
    return this.masterDataService.findAllDistricts();
  }

  @Public()
  @Get('districts/by-city/:cityId')
  async findDistrictsByCityId(@Param('cityId', ParseUUIDPipe) cityId: string) {
    return this.masterDataService.findDistrictsByCityId(cityId);
  }

  @Public()
  @Get('districts/:id')
  async findDistrictById(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterDataService.findDistrictById(id);
  }

  @Post('districts')
  async createDistrict(@Body() dto: CreateDistrictDto) {
    return this.masterDataService.createDistrict(dto);
  }

  @Put('districts/:id')
  async updateDistrict(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDistrictDto,
  ) {
    return this.masterDataService.updateDistrict(id, dto);
  }

  @Delete('districts/:id')
  async deleteDistrict(@Param('id', ParseUUIDPipe) id: string) {
    await this.masterDataService.deleteDistrict(id);
    return { message: 'District deleted successfully' };
  }
}

