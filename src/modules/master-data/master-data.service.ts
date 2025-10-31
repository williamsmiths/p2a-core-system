import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country, City, District } from '@entities';
import { ErrorCode } from '@common';
import { NotFoundException, ConflictException } from '@common';
import {
  CreateCountryDto,
  CreateCityDto,
  CreateDistrictDto,
  UpdateCountryDto,
  UpdateCityDto,
  UpdateDistrictDto,
} from './dto';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  // ==================== COUNTRIES ====================

  async findAllCountries(): Promise<Country[]> {
    return this.countryRepository.find({
      where: { isActive: true },
      relations: ['cities'],
      order: { name: 'ASC' },
    });
  }

  async findCountryById(id: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['cities'],
    });

    if (!country) {
      throw new NotFoundException();
    }

    return country;
  }

  async createCountry(dto: CreateCountryDto): Promise<Country> {
    // Kiểm tra trùng tên hoặc code
    const exists = await this.countryRepository.findOne({
      where: [{ name: dto.name }, ...(dto.code ? [{ code: dto.code }] : [])],
    });

    if (exists) {
      throw new ConflictException(ErrorCode.MASTER_DATA_COUNTRY_ALREADY_EXISTS);
    }

    const country = this.countryRepository.create(dto);
    return this.countryRepository.save(country);
  }

  async updateCountry(id: string, dto: UpdateCountryDto): Promise<Country> {
    const country = await this.findCountryById(id);

    // Kiểm tra trùng tên hoặc code nếu có thay đổi
    if (dto.name || dto.code) {
      const exists = await this.countryRepository
        .createQueryBuilder('country')
        .where('country.id != :id', { id })
        .andWhere('(country.name = :name OR country.code = :code)', {
          name: dto.name || country.name,
          code: dto.code || country.code,
        })
        .getOne();

      if (exists) {
        throw new ConflictException(ErrorCode.MASTER_DATA_COUNTRY_ALREADY_EXISTS);
      }
    }

    Object.assign(country, dto);
    return this.countryRepository.save(country);
  }

  async deleteCountry(id: string): Promise<void> {
    const country = await this.findCountryById(id);
    await this.countryRepository.remove(country);
  }

  // ==================== CITIES ====================

  async findAllCities(): Promise<City[]> {
    return this.cityRepository.find({
      where: { isActive: true },
      relations: ['country', 'districts'],
      order: { name: 'ASC' },
    });
  }

  async findCitiesByCountryId(countryId: string): Promise<City[]> {
    return this.cityRepository.find({
      where: { countryId, isActive: true },
      relations: ['districts'],
      order: { name: 'ASC' },
    });
  }

  async findCityById(id: string): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['country', 'districts'],
    });

    if (!city) {
      throw new NotFoundException();
    }

    return city;
  }

  async createCity(dto: CreateCityDto): Promise<City> {
    // Kiểm tra country tồn tại
    await this.findCountryById(dto.countryId);

    // Kiểm tra trùng tên trong cùng quốc gia
    const exists = await this.cityRepository.findOne({
      where: { name: dto.name, countryId: dto.countryId },
    });

    if (exists) {
      throw new ConflictException(ErrorCode.MASTER_DATA_CITY_ALREADY_EXISTS);
    }

    const city = this.cityRepository.create(dto);
    return this.cityRepository.save(city);
  }

  async updateCity(id: string, dto: UpdateCityDto): Promise<City> {
    const city = await this.findCityById(id);

    // Kiểm tra trùng tên nếu có thay đổi
    if (dto.name) {
      const exists = await this.cityRepository
        .createQueryBuilder('city')
        .where('city.id != :id', { id })
        .andWhere('city.name = :name', { name: dto.name })
        .andWhere('city.countryId = :countryId', { countryId: dto.countryId || city.countryId })
        .getOne();

      if (exists) {
        throw new ConflictException(ErrorCode.MASTER_DATA_CITY_ALREADY_EXISTS);
      }
    }

    // Kiểm tra country mới nếu có thay đổi
    if (dto.countryId && dto.countryId !== city.countryId) {
      await this.findCountryById(dto.countryId);
    }

    Object.assign(city, dto);
    return this.cityRepository.save(city);
  }

  async deleteCity(id: string): Promise<void> {
    const city = await this.findCityById(id);
    await this.cityRepository.remove(city);
  }

  // ==================== DISTRICTS ====================

  async findAllDistricts(): Promise<District[]> {
    return this.districtRepository.find({
      where: { isActive: true },
      relations: ['city', 'city.country'],
      order: { name: 'ASC' },
    });
  }

  async findDistrictsByCityId(cityId: string): Promise<District[]> {
    return this.districtRepository.find({
      where: { cityId, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findDistrictById(id: string): Promise<District> {
    const district = await this.districtRepository.findOne({
      where: { id },
      relations: ['city', 'city.country'],
    });

    if (!district) {
      throw new NotFoundException();
    }

    return district;
  }

  async createDistrict(dto: CreateDistrictDto): Promise<District> {
    // Kiểm tra city tồn tại
    await this.findCityById(dto.cityId);

    // Kiểm tra trùng tên trong cùng thành phố
    const exists = await this.districtRepository.findOne({
      where: { name: dto.name, cityId: dto.cityId },
    });

    if (exists) {
      throw new ConflictException(ErrorCode.MASTER_DATA_DISTRICT_ALREADY_EXISTS);
    }

    const district = this.districtRepository.create(dto);
    return this.districtRepository.save(district);
  }

  async updateDistrict(id: string, dto: UpdateDistrictDto): Promise<District> {
    const district = await this.findDistrictById(id);

    // Kiểm tra trùng tên nếu có thay đổi
    if (dto.name) {
      const exists = await this.districtRepository
        .createQueryBuilder('district')
        .where('district.id != :id', { id })
        .andWhere('district.name = :name', { name: dto.name })
        .andWhere('district.cityId = :cityId', { cityId: dto.cityId || district.cityId })
        .getOne();

      if (exists) {
        throw new ConflictException(ErrorCode.MASTER_DATA_DISTRICT_ALREADY_EXISTS);
      }
    }

    // Kiểm tra city mới nếu có thay đổi
    if (dto.cityId && dto.cityId !== district.cityId) {
      await this.findCityById(dto.cityId);
    }

    Object.assign(district, dto);
    return this.districtRepository.save(district);
  }

  async deleteDistrict(id: string): Promise<void> {
    const district = await this.findDistrictById(id);
    await this.districtRepository.remove(district);
  }
}

