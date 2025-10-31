import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country, City, District } from '@entities';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { MasterDataSeedService } from './master-data-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country, City, District])],
  controllers: [MasterDataController],
  providers: [MasterDataService, MasterDataSeedService],
  exports: [MasterDataService, MasterDataSeedService],
})
export class MasterDataModule {}

