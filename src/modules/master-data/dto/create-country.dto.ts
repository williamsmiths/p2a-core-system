import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  code?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  nameEn?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

