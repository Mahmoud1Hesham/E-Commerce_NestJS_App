import { IsOptional, IsString, MinLength, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFilterDTO {
  @IsString()
  @MinLength(1)
  @IsOptional()
  select?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  sort?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;
}
