import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO cho refresh token
 */
export class RefreshTokenDto {
  @IsString({ message: 'Refresh token phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  refreshToken: string;
}

