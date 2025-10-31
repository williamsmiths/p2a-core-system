import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country, City, District } from '@entities';

@Injectable()
export class MasterDataSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MasterDataSeedService.name);

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedMasterData();
  }

  async seedMasterData() {
    this.logger.log('🌱 Đang kiểm tra và seed master data...');

    try {
      // Kiểm tra xem đã có dữ liệu chưa
      const countryCount = await this.countryRepository.count();
      if (countryCount > 0) {
        this.logger.log('✅ Master data đã tồn tại, bỏ qua seeding');
        return;
      }

      // Seed ASEAN Countries
      await this.seedASEANCountries();

      this.logger.log('✅ Seed master data thành công!');
    } catch (error) {
      this.logger.error('❌ Lỗi khi seed master data:', error.message);
    }
  }

  private async seedASEANCountries() {
    this.logger.log('🌍 Đang seed các quốc gia ASEAN...');

    const aseanData = [
      {
        name: 'Việt Nam',
        code: 'VN',
        nameEn: 'Vietnam',
        cities: [
          {
            name: 'Hà Nội',
            nameEn: 'Hanoi',
            districts: [
              { name: 'Ba Đình', nameEn: 'Ba Dinh' },
              { name: 'Hoàn Kiếm', nameEn: 'Hoan Kiem' },
              { name: 'Đống Đa', nameEn: 'Dong Da' },
              { name: 'Hai Bà Trưng', nameEn: 'Hai Ba Trung' },
              { name: 'Cầu Giấy', nameEn: 'Cau Giay' },
              { name: 'Thanh Xuân', nameEn: 'Thanh Xuan' },
              { name: 'Tây Hồ', nameEn: 'Tay Ho' },
              { name: 'Long Biên', nameEn: 'Long Bien' },
            ],
          },
          {
            name: 'Hồ Chí Minh',
            nameEn: 'Ho Chi Minh City',
            districts: [
              { name: 'Quận 1', nameEn: 'District 1' },
              { name: 'Quận 2', nameEn: 'District 2' },
              { name: 'Quận 3', nameEn: 'District 3' },
              { name: 'Quận 4', nameEn: 'District 4' },
              { name: 'Quận 5', nameEn: 'District 5' },
              { name: 'Quận 6', nameEn: 'District 6' },
              { name: 'Quận 7', nameEn: 'District 7' },
              { name: 'Quận 8', nameEn: 'District 8' },
              { name: 'Quận 9', nameEn: 'District 9' },
              { name: 'Quận 10', nameEn: 'District 10' },
              { name: 'Quận 11', nameEn: 'District 11' },
              { name: 'Quận 12', nameEn: 'District 12' },
              { name: 'Bình Thạnh', nameEn: 'Binh Thanh' },
              { name: 'Tân Bình', nameEn: 'Tan Binh' },
              { name: 'Phú Nhuận', nameEn: 'Phu Nhuan' },
              { name: 'Gò Vấp', nameEn: 'Go Vap' },
              { name: 'Thủ Đức', nameEn: 'Thu Duc' },
            ],
          },
          {
            name: 'Đà Nẵng',
            nameEn: 'Da Nang',
            districts: [
              { name: 'Hải Châu', nameEn: 'Hai Chau' },
              { name: 'Thanh Khê', nameEn: 'Thanh Khe' },
              { name: 'Sơn Trà', nameEn: 'Son Tra' },
              { name: 'Ngũ Hành Sơn', nameEn: 'Ngu Hanh Son' },
              { name: 'Liên Chiểu', nameEn: 'Lien Chieu' },
              { name: 'Cẩm Lệ', nameEn: 'Cam Le' },
            ],
          },
          {
            name: 'Hải Phòng',
            nameEn: 'Hai Phong',
            districts: [
              { name: 'Hồng Bàng', nameEn: 'Hong Bang' },
              { name: 'Lê Chân', nameEn: 'Le Chan' },
              { name: 'Ngô Quyền', nameEn: 'Ngo Quyen' },
              { name: 'Kiến An', nameEn: 'Kien An' },
            ],
          },
          {
            name: 'Cần Thơ',
            nameEn: 'Can Tho',
            districts: [
              { name: 'Ninh Kiều', nameEn: 'Ninh Kieu' },
              { name: 'Ô Môn', nameEn: 'O Mon' },
              { name: 'Bình Thủy', nameEn: 'Binh Thuy' },
              { name: 'Cái Răng', nameEn: 'Cai Rang' },
            ],
          },
        ],
      },
      {
        name: 'Thái Lan',
        code: 'TH',
        nameEn: 'Thailand',
        cities: [
          {
            name: 'Bangkok',
            nameEn: 'Bangkok',
            districts: [
              { name: 'Phra Nakhon', nameEn: 'Phra Nakhon' },
              { name: 'Dusit', nameEn: 'Dusit' },
              { name: 'Nong Chok', nameEn: 'Nong Chok' },
              { name: 'Bang Rak', nameEn: 'Bang Rak' },
              { name: 'Bang Khen', nameEn: 'Bang Khen' },
            ],
          },
          {
            name: 'Chiang Mai',
            nameEn: 'Chiang Mai',
            districts: [
              { name: 'Mueang Chiang Mai', nameEn: 'Mueang Chiang Mai' },
              { name: 'Hang Dong', nameEn: 'Hang Dong' },
              { name: 'San Sai', nameEn: 'San Sai' },
            ],
          },
          {
            name: 'Phuket',
            nameEn: 'Phuket',
            districts: [
              { name: 'Mueang Phuket', nameEn: 'Mueang Phuket' },
              { name: 'Kathu', nameEn: 'Kathu' },
              { name: 'Thalang', nameEn: 'Thalang' },
            ],
          },
        ],
      },
      {
        name: 'Singapore',
        code: 'SG',
        nameEn: 'Singapore',
        cities: [
          {
            name: 'Singapore',
            nameEn: 'Singapore',
            districts: [
              { name: 'Central Region', nameEn: 'Central Region' },
              { name: 'East Region', nameEn: 'East Region' },
              { name: 'North Region', nameEn: 'North Region' },
              { name: 'North-East Region', nameEn: 'North-East Region' },
              { name: 'West Region', nameEn: 'West Region' },
            ],
          },
        ],
      },
      {
        name: 'Malaysia',
        code: 'MY',
        nameEn: 'Malaysia',
        cities: [
          {
            name: 'Kuala Lumpur',
            nameEn: 'Kuala Lumpur',
            districts: [
              { name: 'Bukit Bintang', nameEn: 'Bukit Bintang' },
              { name: 'Cheras', nameEn: 'Cheras' },
              { name: 'Kepong', nameEn: 'Kepong' },
              { name: 'Sentul', nameEn: 'Sentul' },
            ],
          },
          {
            name: 'Penang',
            nameEn: 'Penang',
            districts: [
              { name: 'Georgetown', nameEn: 'Georgetown' },
              { name: 'Bayan Lepas', nameEn: 'Bayan Lepas' },
              { name: 'Butterworth', nameEn: 'Butterworth' },
            ],
          },
          {
            name: 'Johor Bahru',
            nameEn: 'Johor Bahru',
            districts: [
              { name: 'Johor Bahru City', nameEn: 'Johor Bahru City' },
              { name: 'Iskandar Puteri', nameEn: 'Iskandar Puteri' },
              { name: 'Pasir Gudang', nameEn: 'Pasir Gudang' },
            ],
          },
        ],
      },
      {
        name: 'Indonesia',
        code: 'ID',
        nameEn: 'Indonesia',
        cities: [
          {
            name: 'Jakarta',
            nameEn: 'Jakarta',
            districts: [
              { name: 'Jakarta Pusat', nameEn: 'Central Jakarta' },
              { name: 'Jakarta Utara', nameEn: 'North Jakarta' },
              { name: 'Jakarta Barat', nameEn: 'West Jakarta' },
              { name: 'Jakarta Selatan', nameEn: 'South Jakarta' },
              { name: 'Jakarta Timur', nameEn: 'East Jakarta' },
            ],
          },
          {
            name: 'Surabaya',
            nameEn: 'Surabaya',
            districts: [
              { name: 'Surabaya Pusat', nameEn: 'Central Surabaya' },
              { name: 'Surabaya Utara', nameEn: 'North Surabaya' },
              { name: 'Surabaya Timur', nameEn: 'East Surabaya' },
            ],
          },
          {
            name: 'Bandung',
            nameEn: 'Bandung',
            districts: [
              { name: 'Bandung Wetan', nameEn: 'East Bandung' },
              { name: 'Bandung Kulon', nameEn: 'West Bandung' },
              { name: 'Bojongloa Kaler', nameEn: 'North Bojongloa' },
            ],
          },
        ],
      },
      {
        name: 'Philippines',
        code: 'PH',
        nameEn: 'Philippines',
        cities: [
          {
            name: 'Manila',
            nameEn: 'Manila',
            districts: [
              { name: 'Ermita', nameEn: 'Ermita' },
              { name: 'Intramuros', nameEn: 'Intramuros' },
              { name: 'Malate', nameEn: 'Malate' },
              { name: 'Paco', nameEn: 'Paco' },
            ],
          },
          {
            name: 'Quezon City',
            nameEn: 'Quezon City',
            districts: [
              { name: 'Diliman', nameEn: 'Diliman' },
              { name: 'Cubao', nameEn: 'Cubao' },
              { name: 'Project 8', nameEn: 'Project 8' },
            ],
          },
          {
            name: 'Cebu City',
            nameEn: 'Cebu City',
            districts: [
              { name: 'Cebu City North', nameEn: 'Cebu City North' },
              { name: 'Cebu City South', nameEn: 'Cebu City South' },
            ],
          },
        ],
      },
      {
        name: 'Myanmar',
        code: 'MM',
        nameEn: 'Myanmar',
        cities: [
          {
            name: 'Yangon',
            nameEn: 'Yangon',
            districts: [
              { name: 'Downtown', nameEn: 'Downtown' },
              { name: 'Bahan', nameEn: 'Bahan' },
              { name: 'Yankin', nameEn: 'Yankin' },
            ],
          },
          {
            name: 'Mandalay',
            nameEn: 'Mandalay',
            districts: [
              { name: 'Mandalay City', nameEn: 'Mandalay City' },
              { name: 'Amarapura', nameEn: 'Amarapura' },
            ],
          },
        ],
      },
      {
        name: 'Cambodia',
        code: 'KH',
        nameEn: 'Cambodia',
        cities: [
          {
            name: 'Phnom Penh',
            nameEn: 'Phnom Penh',
            districts: [
              { name: 'Daun Penh', nameEn: 'Daun Penh' },
              { name: 'Chamkar Mon', nameEn: 'Chamkar Mon' },
              { name: '7 Makara', nameEn: '7 Makara' },
            ],
          },
          {
            name: 'Siem Reap',
            nameEn: 'Siem Reap',
            districts: [
              { name: 'Siem Reap City', nameEn: 'Siem Reap City' },
              { name: 'Angkor Thom', nameEn: 'Angkor Thom' },
            ],
          },
        ],
      },
      {
        name: 'Laos',
        code: 'LA',
        nameEn: 'Laos',
        cities: [
          {
            name: 'Vientiane',
            nameEn: 'Vientiane',
            districts: [
              { name: 'Chanthabuly', nameEn: 'Chanthabuly' },
              { name: 'Sisattanak', nameEn: 'Sisattanak' },
              { name: 'Xaysetha', nameEn: 'Xaysetha' },
            ],
          },
          {
            name: 'Luang Prabang',
            nameEn: 'Luang Prabang',
            districts: [
              { name: 'Luang Prabang City', nameEn: 'Luang Prabang City' },
            ],
          },
        ],
      },
      {
        name: 'Brunei',
        code: 'BN',
        nameEn: 'Brunei',
        cities: [
          {
            name: 'Bandar Seri Begawan',
            nameEn: 'Bandar Seri Begawan',
            districts: [
              { name: 'Gadong', nameEn: 'Gadong' },
              { name: 'Kiulap', nameEn: 'Kiulap' },
              { name: 'Berakas', nameEn: 'Berakas' },
            ],
          },
        ],
      },
    ];

    for (const countryData of aseanData) {
      const { cities, ...countryInfo } = countryData;

      // Tạo country
      const country = this.countryRepository.create(countryInfo);
      const savedCountry = await this.countryRepository.save(country);
      this.logger.log(`  ✓ Đã tạo quốc gia: ${savedCountry.name}`);

      // Tạo cities và districts
      for (const cityData of cities) {
        const { districts, ...cityInfo } = cityData;

        const city = this.cityRepository.create({
          ...cityInfo,
          countryId: savedCountry.id,
        });
        const savedCity = await this.cityRepository.save(city);
        this.logger.log(`    ✓ Đã tạo thành phố: ${savedCity.name}`);

        // Tạo districts
        for (const districtData of districts) {
          const district = this.districtRepository.create({
            ...districtData,
            cityId: savedCity.id,
          });
          await this.districtRepository.save(district);
        }
        this.logger.log(`      ✓ Đã tạo ${districts.length} quận/huyện`);
      }
    }

    this.logger.log('✅ Đã seed xong dữ liệu các quốc gia ASEAN');
  }
}

