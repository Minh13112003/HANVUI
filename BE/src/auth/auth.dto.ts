import { Transform, Type } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsOptional, IsString, Length, Max, MaxLength, Min, MinLength } from 'class-validator';

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

/** Đổi hồ sơ: chuẩn HSK, cấp hiện tại, tên hiển thị (rule.md mục 2). */
export class UpdateMeDto {
  @IsOptional() @IsIn(['HSK2', 'HSK3']) hskStandard?: 'HSK2' | 'HSK3';

  // HSK 2.0 có 6 cấp, HSK 3.0 có 9 cấp; service kiểm tra cho khớp chuẩn.
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(9) hskLevel?: number;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 40)
  displayName?: string;
}
