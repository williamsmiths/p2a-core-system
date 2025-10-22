import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO cho xác thực email
 */
export class VerifyEmailDto {
  @IsString({ message: 'Token phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;
}

