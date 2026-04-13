import { IsOptional, IsString, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  theme?: 'light' | 'dark' | 'system';

  @IsOptional()
  @IsString()
  angleUnit?: 'degrees' | 'radians';

  @IsOptional()
  @IsBoolean()
  thousandsSeparator?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  decimalPlaces?: number;

  @IsOptional()
  @IsBoolean()
  hapticFeedback?: boolean;
}
