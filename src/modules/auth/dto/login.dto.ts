import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO cho đăng nhập
 */
export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

