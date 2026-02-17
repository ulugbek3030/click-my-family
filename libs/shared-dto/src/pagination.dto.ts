import { IsOptional, IsPositive, Max, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsPositive()
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;

  constructor(data: T[], total: number, limit: number, offset: number) {
    this.data = data;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
  }
}
