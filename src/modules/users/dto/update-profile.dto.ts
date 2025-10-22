import { IsOptional, IsString, MaxLength, IsUrl, IsDateString, IsIn } from 'class-validator';

/**
 * DTO cho cập nhật profile
 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Họ tên không được quá 255 ký tự' })
  fullName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL không hợp lệ' })
  avatarUrl?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Số điện thoại không được quá 50 ký tự' })
  phoneNumber?: string;

  @IsOptional()
  @IsString({ message: 'Quốc gia phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Quốc gia không được quá 100 ký tự' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Thành phố phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Thành phố không được quá 100 ký tự' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Bio phải là chuỗi ký tự' })
  bio?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString({ message: 'Giới tính phải là chuỗi ký tự' })
  @IsIn(['male', 'female', 'other'], { message: 'Giới tính không hợp lệ' })
  gender?: string;

  @IsOptional()
  @IsUrl({}, { message: 'LinkedIn URL không hợp lệ' })
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Website URL không hợp lệ' })
  websiteUrl?: string;
}

