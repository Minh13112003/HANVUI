import { Transform, Type } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';

export class ListMailQuery {
  /** ADMIN = thư quản trị gửi, SYSTEM = thư tự động của hệ thống. */
  @IsOptional() @IsIn(['ADMIN', 'SYSTEM']) sender?: 'ADMIN' | 'SYSTEM';
  /** "true" = chỉ thư có quà, "false" = chỉ thư không có quà. */
  @IsOptional() @IsIn(['true', 'false']) reward?: 'true' | 'false';
  @IsOptional() @IsIn(['true', 'false']) unread?: 'true' | 'false';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(1000) page?: number;
}

export class SendMailDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 120)
  subject!: string;

  @IsString()
  @Length(1, 4000)
  body!: string;

  /** Số lượt gợi ý tặng kèm (0 = không có quà lượt). */
  @IsOptional() @IsInt() @Min(0) @Max(100_000) rewardTokens?: number;

  /** Vật phẩm tặng kèm (hiện chỉ có VIP 3 ngày). */
  @IsOptional() @IsIn(['VIP_3D']) rewardItem?: 'VIP_3D';

  /** Bỏ trống = gửi cho tất cả mọi người. */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(254)
  toEmail?: string;

  /** Số ngày được nhận quà; bỏ trống = không hết hạn. */
  @IsOptional() @IsInt() @Min(1) @Max(365) expiresInDays?: number;
}
