import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateCalculationDto {
  @IsString()
  expression: string;

  @IsString()
  result: string;

  @IsOptional()
  @IsIn(['web', 'ios', 'android', 'desktop'])
  deviceOrigin?: string;
}
