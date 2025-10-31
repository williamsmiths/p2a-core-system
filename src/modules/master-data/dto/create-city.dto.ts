import { IsString, IsOptional, IsBoolean, IsUUID, MaxLength } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  nameEn?: string;

  @IsUUID()
  countryId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

