import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, MaxLength, MinLength } from 'class-validator';

const trimLower = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value);

export class RegisterDto {
  @Transform(trimLower)
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(254)
  email!: string;

  // bcrypt chỉ dùng 72 byte đầu nên chặn ở 72
  @IsString()
  @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
  @MaxLength(72, { message: 'Mật khẩu tối đa 72 ký tự' })
  password!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 40, { message: 'Tên hiển thị 1-40 ký tự' })
  displayName!: string;
}

export class LoginDto {
  @Transform(trimLower)
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @IsString()
  @MaxLength(72)
  password!: string;
}

export class RefreshDto {
  @IsString()
  @MaxLength(200)
  refreshToken!: string;
}
