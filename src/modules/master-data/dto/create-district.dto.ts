import { IsString, IsOptional, IsBoolean, IsUUID, MaxLength } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  nameEn?: string;

  @IsUUID()
  cityId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

